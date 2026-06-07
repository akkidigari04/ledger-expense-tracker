const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db');

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const expenseService = {
  /**
   * Returns all expenses, optionally filtered by category and/or date range.
   * Sorted newest-first by date then created_at.
   */
  getAll({ category, startDate, endDate } = {}) {
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC, created_at DESC';
    return db.prepare(query).all(...params);
  },

  getById(id) {
    return db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
  },

  create({ amount, category, date, note = '' }) {
    const id = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO expenses (id, amount, category, date, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, amount, category, date, note, now, now);
    return this.getById(id);
  },

  update(id, { amount, category, date, note }) {
    const existing = this.getById(id);
    if (!existing) return null;

    const updated = {
      amount:   amount   ?? existing.amount,
      category: category ?? existing.category,
      date:     date     ?? existing.date,
      note:     note     !== undefined ? note : existing.note,
    };

    db.prepare(`
      UPDATE expenses
      SET amount = ?, category = ?, date = ?, note = ?, updated_at = ?
      WHERE id = ?
    `).run(updated.amount, updated.category, updated.date, updated.note, new Date().toISOString(), id);

    return this.getById(id);
  },

  delete(id) {
    const existing = this.getById(id);
    if (!existing) return false;
    db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
    return true;
  },

  /**
   * Summary statistics: monthly total, per-category totals, highest single expense.
   * Accepts optional startDate / endDate filters matching current filter state.
   */
  getSummary({ startDate, endDate } = {}) {
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString().split('T')[0];

    // Total this calendar month
    const { total_month } = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total_month
      FROM expenses
      WHERE date >= ? AND date <= ?
    `).get(monthStart, monthEnd);

    // Per-category totals for the filtered view (or month if no filter)
    const effectiveStart = startDate || monthStart;
    const effectiveEnd   = endDate   || monthEnd;

    const byCategory = db.prepare(`
      SELECT category, COALESCE(SUM(amount), 0) as total
      FROM expenses
      WHERE date >= ? AND date <= ?
      GROUP BY category
    `).all(effectiveStart, effectiveEnd);

    // Highest single expense (all-time, unfiltered)
    const highest = db.prepare(`
      SELECT * FROM expenses ORDER BY amount DESC LIMIT 1
    `).get() || null;

    return { total_month, by_category: byCategory, highest_expense: highest };
  },

  getCategories() {
    return VALID_CATEGORIES;
  },

  /**
   * Export filtered expenses as a CSV string.
   */
  exportCSV(filters) {
    const expenses = this.getAll(filters);
    const header = 'id,amount,category,date,note,created_at';
    const rows = expenses.map(e =>
      `${e.id},${e.amount},${e.category},${e.date},"${(e.note || '').replace(/"/g, '""')}",${e.created_at}`
    );
    return [header, ...rows].join('\n');
  },
};

module.exports = expenseService;
