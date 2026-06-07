const { validationResult } = require('express-validator');
const budgetService = require('../services/budgetService');

const budgetController = {
  list(_req, res) {
    const budgets = budgetService.getAll();
    res.json({ data: budgets });
  },

  upsert(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { category, amount } = req.body;
    const budget = budgetService.upsert(category, amount);
    res.json({ data: budget });
  },

  destroy(req, res) {
    const deleted = budgetService.delete(req.params.category);
    if (!deleted) return res.status(404).json({ error: 'Budget not found' });
    res.status(204).send();
  },
};

module.exports = budgetController;
