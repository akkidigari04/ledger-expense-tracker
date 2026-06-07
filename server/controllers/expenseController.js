const { validationResult } = require('express-validator');
const expenseService = require('../services/expenseService');

const expenseController = {
  list(req, res) {
    const { category, startDate, endDate } = req.query;
    const expenses = expenseService.getAll({ category, startDate, endDate });
    res.json({ data: expenses, count: expenses.length });
  },

  show(req, res) {
    const expense = expenseService.getById(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ data: expense });
  },

  create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const expense = expenseService.create(req.body);
    res.status(201).json({ data: expense });
  },

  update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const expense = expenseService.update(req.params.id, req.body);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ data: expense });
  },

  destroy(req, res) {
    const deleted = expenseService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Expense not found' });
    res.status(204).send();
  },

  summary(req, res) {
    const { startDate, endDate } = req.query;
    const summary = expenseService.getSummary({ startDate, endDate });
    res.json({ data: summary });
  },

  exportCSV(req, res) {
    const { category, startDate, endDate } = req.query;
    const csv = expenseService.exportCSV({ category, startDate, endDate });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
    res.send(csv);
  },
};

module.exports = expenseController;
