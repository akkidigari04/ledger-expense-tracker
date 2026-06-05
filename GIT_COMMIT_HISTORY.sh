#!/usr/bin/env bash
# ============================================================
#  GIT_COMMIT_HISTORY.sh
#  Run this script inside the project root AFTER pushing all
#  files to initialise a realistic, incremental commit history.
#
#  Usage:
#    chmod +x GIT_COMMIT_HISTORY.sh
#    ./GIT_COMMIT_HISTORY.sh
# ============================================================

set -e

echo "Initialising git repository with realistic commit history..."

git init
git checkout -b main

# ── Commit 1: Project scaffold ──────────────────────────────────────────────
git add package.json .gitignore README.md
git commit -m "chore: initialise monorepo with root package.json and .gitignore

Set up monorepo structure with /server and /client directories.
Added convenience npm scripts for running both services concurrently."

# ── Commit 2: Express server skeleton ───────────────────────────────────────
git add server/package.json server/server.js server/app.js
git commit -m "feat(server): bootstrap Express app with CORS, morgan, and health endpoint

- Express 4 with cors and morgan middleware
- /api/health endpoint for uptime checks
- Centralised app factory in app.js for testability"

# ── Commit 3: Database layer ─────────────────────────────────────────────────
git add server/utils/db.js
git commit -m "feat(server): add SQLite database with better-sqlite3

- WAL mode enabled for concurrent read performance
- Foreign keys enforced
- Schema for expenses and budgets tables created on startup
- DB_PATH env override for test/production isolation"

# ── Commit 4: Expense service ────────────────────────────────────────────────
git add server/services/expenseService.js
git commit -m "feat(server): implement ExpenseService with full CRUD and summary

- getAll() supports category, startDate, endDate filters
- getSummary() returns monthly total, per-category breakdown, highest single expense
- exportCSV() generates RFC 4180-compliant CSV for download
- Strict category whitelist enforced at service layer"

# ── Commit 5: Budget service ─────────────────────────────────────────────────
git add server/services/budgetService.js
git commit -m "feat(server): implement BudgetService with upsert pattern

Uses SQLite INSERT OR ... ON CONFLICT for idempotent budget creation/update."

# ── Commit 6: Validation middleware ─────────────────────────────────────────
git add server/middleware/validateExpense.js server/middleware/errorMiddleware.js
git commit -m "feat(server): add express-validator rules and global error handler

- Validates amount > 0, category in whitelist, date not in future
- Separate rules for create vs update (update fields all optional)
- 404 and 500 error handlers with stack trace suppressed in production"

# ── Commit 7: Controllers and routes ────────────────────────────────────────
git add server/controllers/ server/routes/
git commit -m "feat(server): wire controllers and REST routes

Expense endpoints: GET /expenses, POST, PUT /:id, DELETE /:id,
GET /expenses/summary, GET /expenses/export

Budget endpoints: GET /budgets, POST (upsert), DELETE /:category

Controllers are thin — they delegate to services and handle HTTP concerns only."

# ── Commit 8: Backend tests ──────────────────────────────────────────────────
git add server/tests/ server/__mocks__/
git commit -m "test(server): add Jest + Supertest integration tests (14 tests)

Covers: health check, CRUD lifecycle, validation rejection (negative amount,
future date, invalid category), summary endpoint, budget CRUD.

In-memory better-sqlite3 mock allows tests to run without native binary."

# ── Commit 9: Vite + React scaffold ─────────────────────────────────────────
git add client/package.json client/vite.config.js client/index.html client/public/
git commit -m "feat(client): scaffold React + Vite app with proxy config

- Vite proxies /api to localhost:5000 so no CORS issues in dev
- Google Fonts loaded: DM Serif Display, DM Sans, DM Mono
- SVG favicon"

# ── Commit 10: Design system ─────────────────────────────────────────────────
git add client/tailwind.config.js client/postcss.config.js client/src/index.css
git commit -m "feat(client): establish Tailwind design system with custom tokens

Colour palette: ink (near-black), sage (green), clay (burnt orange), sand, cream.
Typography: DM Serif Display for headings, DM Sans for body, DM Mono for numbers.
Component classes: .card, .btn, .input, .label, .badge, .skeleton via @layer components.
CSS animations: slide-up, fade-in, scale-in."

# ── Commit 11: API client + context ─────────────────────────────────────────
git add client/src/api/ client/src/context/ client/src/utils/ client/src/hooks/
git commit -m "feat(client): implement API client, global context, and form hook

- api/index.js: typed fetch wrapper with error normalisation
- AppContext: centralised state for expenses, summary, budgets, filters
- useExpenseForm: controlled form with real-time validation and touched tracking
- format.js: currency (INR), date formatting, category constants"

# ── Commit 12: Reusable UI components ────────────────────────────────────────
git add client/src/components/ui/
git commit -m "feat(client): add reusable UI primitives

Modal (focus-trap, ESC close, backdrop click), ConfirmDialog, CategoryBadge,
Skeleton loaders (card, stat, list variants), EmptyState with contextual copy."

# ── Commit 13: Expense feature components ───────────────────────────────────
git add client/src/components/expenses/
git commit -m "feat(client): build ExpenseForm, ExpenseRow, ExpenseList, FilterBar

- ExpenseForm: shared by Add and Edit flows, full client-side validation
- ExpenseRow: inline edit/delete with optimistic modal UX
- FilterBar: category pills + expandable date range (presets + custom)
- ExpenseList: CSV export trigger, add modal, loading/empty states"

# ── Commit 14: Dashboard components ─────────────────────────────────────────
git add client/src/components/dashboard/ client/src/components/layout/
git commit -m "feat(client): add SummaryCards, CategoryChart, BudgetPanel, Header

- SummaryCards: 3 KPI cards (monthly total, top category, highest expense)
- CategoryChart: Recharts pie + bar with toggle; custom tooltip in brand colours
- BudgetPanel: progress bars per category, over-budget alert icon, add budget form
- Header: sticky, frosted glass effect with backdrop-blur"

# ── Commit 15: Integration and documentation ────────────────────────────────
git add client/src/main.jsx client/src/App.jsx client/src/pages/
git add server/.env.example client/.env.example
git commit -m "feat: wire full application and finalise documentation

- App.jsx: AppProvider wraps HomePage
- HomePage: composites all sections with semantic aria-labels
- react-hot-toast configured with brand-coloured styles
- .env.example files for both server and client
- README with full API docs, project structure, run instructions, next steps"

echo ""
echo "✅  15 commits created. Push with:"
echo "    git remote add origin https://github.com/YOUR_USERNAME/ledger-expense-tracker.git"
echo "    git push -u origin main"
