const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { body } = require('express-validator');

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const budgetRules = [
  body('category').isIn(VALID_CATEGORIES).withMessage('Invalid category'),
  body('amount').isFloat({ gt: 0 }).withMessage('Budget must be a positive number'),
];

router.get('/',                   budgetController.list);
router.post('/',    budgetRules,   budgetController.upsert);
router.delete('/:category',       budgetController.destroy);

module.exports = router;
