const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { createExpenseRules, updateExpenseRules } = require('../middleware/validateExpense');

router.get('/',          expenseController.list);
router.get('/summary',   expenseController.summary);
router.get('/export',    expenseController.exportCSV);
router.get('/:id',       expenseController.show);
router.post('/',         createExpenseRules, expenseController.create);
router.put('/:id',       updateExpenseRules, expenseController.update);
router.delete('/:id',    expenseController.destroy);

module.exports = router;
