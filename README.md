# Ledger — Mini Expense Tracker

> **Exercise 2: Mini Expense Tracker** — Studio Graphene Full Stack Developer Assessment

A full-stack personal expense tracker built with **React + Vite** (frontend) and **Node.js + Express** (backend). Users can log daily spending across categories, filter by date and category, visualise spending with charts, set per-category budgets, and export data as CSV. Data is persisted in a local **SQLite** database via `better-sqlite3`.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://ledger-expense-tracker.vercel.app *(deploy to update)* |
| Backend  | https://ledger-api.onrender.com *(deploy to update)* |

> Test from an incognito window to verify cross-origin communication.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend framework | React 18 + Vite | Fast HMR, modern toolchain, functional components + hooks |
| Styling | Tailwind CSS | Utility-first, responsive by default, consistent design tokens |
| Charts | Recharts | React-native, composable, minimal bundle cost |
| Toasts | react-hot-toast | Accessible, lightweight notification system |
| Date utils | date-fns | Tree-shakeable, lightweight alternative to moment |
| Icons | lucide-react | Consistent, tree-shakeable SVG icons |
| Backend framework | Express 4 | Minimal, well-understood, excellent middleware ecosystem |
| Validation | express-validator | Declarative, co-located with routes |
| Database | SQLite via better-sqlite3 | Persistent, zero-config, synchronous API simplifies service layer |
| Testing | Jest + Supertest | Industry standard for Node.js API testing |
| Logging | Morgan | HTTP request logging out of the box |

---

## How to Run Locally

> **Prerequisites:** Node.js ≥ 18 and npm installed.

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/ledger-expense-tracker.git
cd ledger-expense-tracker

npm run install:all        # installs server/ and client/ dependencies
```

### 2. Environment variables

```bash
# Server
cp server/.env.example server/.env

# Client (only needed for production; dev uses Vite proxy)
cp client/.env.example client/.env
```

### 3. Start development servers

```bash
# Option A — both at once (requires Unix shell)
npm run dev

# Option B — separate terminals
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:5173
```

Open **http://localhost:5173** in your browser.

### 4. Run tests

```bash
npm test             # runs server Jest tests
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Expenses

#### `GET /expenses`
Returns expenses, optionally filtered.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category (`Food`, `Transport`, `Bills`, `Entertainment`, `Other`) |
| `startDate` | YYYY-MM-DD | Lower bound (inclusive) |
| `endDate` | YYYY-MM-DD | Upper bound (inclusive) |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "amount": 250.50,
      "category": "Food",
      "date": "2024-06-01",
      "note": "Lunch",
      "created_at": "2024-06-01T10:00:00.000Z",
      "updated_at": "2024-06-01T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### `GET /expenses/summary`
Returns aggregated statistics.

**Query params:** `startDate`, `endDate` (optional, defaults to current month)

**Response:**
```json
{
  "data": {
    "total_month": 4200.00,
    "by_category": [
      { "category": "Food", "total": 1800.00 }
    ],
    "highest_expense": { "id": "...", "amount": 1500.00, "category": "Bills", ... }
  }
}
```

#### `GET /expenses/export`
Returns a CSV file download. Accepts same query params as `GET /expenses`.

#### `GET /expenses/:id`
Returns a single expense.

**Response:** `{ "data": { ...expense } }` or `404`

#### `POST /expenses`
Creates an expense.

**Body:**
```json
{
  "amount": 250.50,
  "category": "Food",
  "date": "2024-06-01",
  "note": "Lunch"
}
```

**Validation:**
- `amount` — required, positive number
- `category` — required, one of: Food, Transport, Bills, Entertainment, Other
- `date` — required, YYYY-MM-DD, not in the future
- `note` — optional, max 500 chars

**Response:** `201 { "data": { ...expense } }` or `400 { "errors": [...] }`

#### `PUT /expenses/:id`
Updates an expense (partial update, all fields optional).

**Response:** `{ "data": { ...expense } }` or `404`

#### `DELETE /expenses/:id`
Deletes an expense.

**Response:** `204 No Content` or `404`

---

### Budgets

#### `GET /budgets`
Returns all budgets.
**Response:** `{ "data": [{ "category": "Food", "amount": 5000, "updated_at": "..." }] }`

#### `POST /budgets`
Creates or updates a category budget (upsert).

**Body:** `{ "category": "Food", "amount": 5000 }`

**Response:** `{ "data": { ...budget } }` or `400`

#### `DELETE /budgets/:category`
Removes a budget.
**Response:** `204` or `404`

---

## Project Structure

```
ledger-expense-tracker/
├── package.json              # root convenience scripts
├── server/
│   ├── app.js                # Express app factory (middleware + routes)
│   ├── server.js             # Entry point — binds port
│   ├── routes/
│   │   ├── expenses.js       # Expense route definitions
│   │   └── budgets.js        # Budget route definitions
│   ├── controllers/
│   │   ├── expenseController.js   # HTTP handlers for expenses
│   │   └── budgetController.js    # HTTP handlers for budgets
│   ├── services/
│   │   ├── expenseService.js      # Business logic + DB queries
│   │   └── budgetService.js       # Budget CRUD + DB queries
│   ├── middleware/
│   │   ├── validateExpense.js     # express-validator rules
│   │   └── errorMiddleware.js     # 404 + global error handler
│   ├── utils/
│   │   └── db.js                  # SQLite connection + schema init
│   ├── tests/
│   │   └── expenses.test.js       # Jest + Supertest integration tests
│   └── data/                      # SQLite file created at runtime (gitignored)
│
└── client/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx           # React entry point
        ├── App.jsx            # Root + context provider
        ├── index.css          # Tailwind + custom component classes
        ├── api/
        │   └── index.js       # Typed API client (fetch wrapper)
        ├── context/
        │   └── AppContext.jsx # Global state (expenses, summary, budgets, filters)
        ├── hooks/
        │   └── useExpenseForm.js  # Form state + validation
        ├── utils/
        │   └── format.js     # Currency, date formatting; category constants
        ├── components/
        │   ├── ui/            # Reusable: Modal, Skeleton, EmptyState, Badges, ConfirmDialog
        │   ├── expenses/      # ExpenseList, ExpenseRow, ExpenseForm, FilterBar
        │   ├── dashboard/     # SummaryCards, CategoryChart, BudgetPanel
        │   └── layout/        # Header
        └── pages/
            └── HomePage.jsx   # Main page (composes all sections)
```

---

## Next Steps

Given more time, I would:

1. **Authentication** — JWT-based auth so multiple users can each have their own expense sets.
2. **Recurring expenses** — Mark an expense as recurring (monthly/weekly) and auto-create future entries.
3. **Pagination** — Large datasets should load incrementally; the API is ready but the frontend renders all at once.
4. **Unit tests for frontend** — `@testing-library/react` tests for `ExpenseForm` validation, `FilterBar` state changes.
5. **More chart types** — A line/area chart of daily spending over time to spot trends.
6. **PWA support** — Service worker + offline caching so the app works without internet.
7. **Multi-currency** — Let the user choose a base currency rather than hardcoding INR.
8. **Drag-to-reorder** — Manual ordering of expense rows within a date.

---

## Attribution

- UI design system is original. DM Serif Display / DM Sans / DM Mono fonts via Google Fonts.
- Used Claude (Anthropic) as an AI coding assistant throughout; every line has been reviewed and understood.

---

*Studio Graphene Assessment — Full Stack Developer (Node.js + React Programme)*
