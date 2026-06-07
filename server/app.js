const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budgets');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ledger-expense-tracker-mu.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'test' ? 'silent' : 'dev'));

// ── Routes ─────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

// ── Error Handling ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
