const db = require('../utils/db');

const budgetService = {
  getAll() {
    return db.prepare('SELECT * FROM budgets').all();
  },

  upsert(category, amount) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO budgets (category, amount, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(category) DO UPDATE SET amount = excluded.amount, updated_at = excluded.updated_at
    `).run(category, amount, now);
    return db.prepare('SELECT * FROM budgets WHERE category = ?').get(category);
  },

  delete(category) {
    const result = db.prepare('DELETE FROM budgets WHERE category = ?').run(category);
    return result.changes > 0;
  },
};

module.exports = budgetService;
