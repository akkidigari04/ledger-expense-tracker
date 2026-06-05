# Interview Preparation Notes
## Studio Graphene — Full Stack Developer Technical Discussion

---

## Why I Chose Exercise 2 (Mini Expense Tracker)

Exercise 2 maximises score across every rubric dimension:
- **Code Quality** — Data aggregation, service layer abstraction, and form validation logic show more structured thinking than a basic CRUD list.
- **Functionality** — More moving parts (filters, summary, charts, budgets, CSV export) = more to showcase.
- **Full Stack Integration** — The summary endpoint with parameterised queries, category grouping, and budget comparison demonstrates REST design beyond simple pass-through.
- **UI/UX** — Charts, progress bars, and filter presets create a genuinely useful interface reviewers can interact with.
- **Bonus** — CSV export, budget tracking with visual alerts, and SQLite persistence hit every bonus criterion.

---

## Architecture Decisions

### 1. Why Express over Fastify?
Express has a larger middleware ecosystem and is universally familiar to reviewers. Fastify's performance advantages are irrelevant at this scale. The choice signals pragmatism over trend-chasing.

### 2. Why SQLite over JSON file?
A JSON file requires reading/writing the entire dataset on every mutation, which becomes slow and risks corruption on concurrent writes. SQLite gives us:
- Atomic transactions
- Indexed queries for filtering
- Aggregation functions (`SUM`, `GROUP BY`) that would need manual loops in JS
- Zero additional infrastructure — it's a single file

`better-sqlite3` is synchronous (no `await` clutter in service methods) and significantly faster than the async `sqlite3` package.

### 3. Why separate `app.js` from `server.js`?
`server.js` only binds the port. `app.js` exports the Express app as a module. This lets `supertest` import the app directly without starting a real server, which is essential for clean integration tests.

### 4. Why Context API over Redux?
Redux adds boilerplate (actions, reducers, store) that is unjustified for an app of this complexity. React Context + `useCallback` is sufficient. If the app grew to need optimistic updates or complex derived state, I'd consider Zustand before Redux.

### 5. Why a custom fetch wrapper instead of Axios?
The native `fetch` API is available in all modern browsers and Node 18+. A thin wrapper (`api/index.js`) gives us consistent error normalisation and base URL injection without adding a dependency. Axios would be fine too — this is a deliberate minimalism choice.

### 6. Why `useExpenseForm` as a custom hook?
The form logic (values, errors, touched state, validation, submit guard) is reused in both the "Add" and "Edit" flows. Extracting it to a hook keeps both `ExpenseForm` usage sites identical and makes the validation logic independently testable.

### 7. Why `express-validator` over manual validation?
`express-validator` provides declarative, chainable rules that are co-located with routes. Manual validation in controllers would be repetitive and harder to read. The rules are also easily extended (e.g. adding a `sanitize()` step).

### 8. Why Recharts over Chart.js?
Recharts is built for React — components, not imperative canvas commands. It composes naturally with JSX, supports responsive containers out of the box, and tree-shakes unused chart types. Chart.js is excellent but requires refs and imperative lifecycle management in React.

---

## Key Code Walkthrough Points

### Service layer pattern
```js
// expenseService.js — reviewers will notice this is NOT in the controller
getAll({ category, startDate, endDate } = {}) {
  let query = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];
  if (category && category !== 'All') { query += ' AND category = ?'; params.push(category); }
  // ...
}
```
The `WHERE 1=1` trick allows dynamically appending `AND` clauses without checking if it's the first clause. This is idiomatic SQL composition.

### Validation — future date check
```js
.custom((value) => {
  if (value > today()) throw new Error('Date cannot be in the future');
  return true;
})
```
ISO date strings (YYYY-MM-DD) compare lexicographically correctly, so string comparison works here without Date parsing.

### AppContext — filter state flow
Filters live in Context. When the user changes a filter, `applyFilters()` updates the filter state AND immediately re-fetches — preventing the "stale filter" bug where state updates are async and you fetch with the old value.

### `useExpenseForm` — touched + validate pattern
```js
// Only show error after field has been visited (touched)
{touched.amount && errors.amount && <p>{errors.amount}</p>}
```
This prevents the form from showing all errors on first render (a common UX mistake).

---

## Common Interviewer Questions

**Q: How does the summary endpoint work? Walk me through a request.**

A: The frontend calls `GET /api/expenses/summary`. The controller delegates to `expenseService.getSummary()`. The service runs three SQL queries synchronously:
1. `SUM(amount)` filtered to the current calendar month for the monthly total.
2. `SUM(amount) GROUP BY category` for the filtered date range (per-category breakdown).
3. `SELECT * ORDER BY amount DESC LIMIT 1` for the single highest expense.

These return instantly since SQLite reads are synchronous. The controller shapes the three results into one JSON response.

---

**Q: What happens if two users submit expenses at the same time?**

A: SQLite handles concurrent writes with WAL (Write-Ahead Logging) mode, which allows concurrent readers and one writer. Since `better-sqlite3` is synchronous, each write is fully serialised at the Node.js thread level anyway. For true multi-user concurrency you'd move to PostgreSQL with a connection pool.

---

**Q: How would you add authentication?**

A: I'd add a `users` table with hashed passwords (bcrypt). On login, issue a signed JWT (jsonwebtoken). Add an `authenticate` middleware that verifies the JWT on every protected route and attaches `req.userId`. Add a `user_id` foreign key to both `expenses` and `budgets` tables, and scope all queries with `WHERE user_id = ?`.

---

**Q: Your app crashes if the SQLite file is deleted. How would you handle that?**

A: The `db.js` initialisation already creates the data directory and tables on startup with `CREATE TABLE IF NOT EXISTS`, so a missing file is automatically recreated (empty). Data loss is unavoidable without backups, but the app doesn't crash. In production I'd add a scheduled backup to cloud storage (S3/R2).

---

**Q: Why not use React Query / TanStack Query?**

A: React Query is excellent for server state management and would eliminate the manual `loading`, `error` state boilerplate in AppContext. I chose not to add it because: (1) it's another dependency to explain, (2) the custom Context implementation demonstrates the same concepts at a level reviewers can inspect and understand without prior React Query knowledge.

---

**Q: The filter state and fetch are coupled in AppContext. Is that a concern?**

A: It's a deliberate design choice for this scale. The alternative is separating filter state from fetch effects — but that risks the "stale closure" bug where a `useEffect` dependency on `filters` fires with a stale value. Co-locating them in `applyFilters()` makes the data flow explicit and easy to trace.

---

**Q: How would you paginate the expense list?**

A: Add `limit` and `offset` query params to `GET /expenses`. The SQL becomes `...LIMIT ? OFFSET ?`. The API response would include `{ data, count, page, totalPages }`. The frontend would track `page` state and show a "Load more" button or pagination controls. The `count` query (`SELECT COUNT(*) FROM expenses WHERE ...`) gives total pages without fetching all rows.

---

**Q: Your CSV export is a direct link to the backend. What are the security implications?**

A: In this single-user app without auth it's fine. In a multi-user app, you'd protect the endpoint with a JWT, or generate a short-lived signed URL (like S3 presigned URLs) on the backend and redirect the user to that URL — so the download is authenticated without embedding tokens in frontend JS.

---

**Q: How did you handle the "no future dates" validation?**

A: In two places — belt and suspenders:
1. **Frontend**: `max={today()}` on the `<input type="date">` prevents the browser datepicker from selecting future dates.
2. **Backend**: `express-validator` `.custom()` rule compares the ISO string lexicographically with today's date and throws if it's in the future.

Server-side validation is authoritative; client-side is UX convenience.

---

## What I'd Do Differently With More Time

1. **Frontend tests** — `@testing-library/react` tests for `ExpenseForm` (validate rejects future date), `FilterBar` (category pills update context), and `SummaryCards` (renders skeleton on loading state).
2. **Optimistic updates** — Instead of re-fetching everything after a mutation, update the local state immediately and roll back on error. This makes the UI feel snappier.
3. **Error boundary** — A React ErrorBoundary around the charts so a Recharts crash doesn't white-screen the entire page.
4. **Rate limiting** — `express-rate-limit` middleware to prevent abuse of the public API.
5. **Proper logging** — Replace `console.error` with a structured logger (pino) that includes request IDs for distributed tracing.
6. **CI pipeline** — GitHub Actions workflow: lint → test → build on every PR.
