const { body } = require('express-validator');

const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const today = () => new Date().toISOString().split('T')[0];

const createExpenseRules = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('date')
    .isDate()
    .withMessage('Date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      if (value > today()) throw new Error('Date cannot be in the future');
      return true;
    }),
  body('note')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note must be under 500 characters'),
];

const updateExpenseRules = [
  body('amount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('date')
    .optional()
    .isDate()
    .withMessage('Date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      if (value > today()) throw new Error('Date cannot be in the future');
      return true;
    }),
  body('note')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note must be under 500 characters'),
];

module.exports = { createExpenseRules, updateExpenseRules };
