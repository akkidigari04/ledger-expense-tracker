// In-memory mock of better-sqlite3 for the sandbox test environment.
// In production on a real machine, the native binary compiles fine.

const store = { expenses: {}, budgets: {} };

function makeDb() {
  const stmts = {};

  function prepare(sql) {
    return {
      run:  (...args) => runSQL(sql, args),
      get:  (...args) => getSQL(sql, args),
      all:  (...args) => allSQL(sql, args),
    };
  }

  function exec(sql) {
    // schema init – no-op in mock
  }

  function pragma() {}

  return { prepare, exec, pragma };
}

// ── Very small SQL interpreter ───────────────────────────────────────────
function runSQL(sql, args) {
  const s = sql.trim().toUpperCase();

  if (s.startsWith('INSERT INTO EXPENSES')) {
    const [id, amount, category, date, note, created_at, updated_at] = args;
    store.expenses[id] = { id, amount, category, date, note, created_at, updated_at };
    return { changes: 1 };
  }
  if (s.startsWith('UPDATE EXPENSES')) {
    const [amount, category, date, note, updated_at, id] = args;
    if (store.expenses[id]) {
      Object.assign(store.expenses[id], { amount, category, date, note, updated_at });
    }
    return { changes: store.expenses[id] ? 1 : 0 };
  }
  if (s.startsWith('DELETE FROM EXPENSES')) {
    const id = args[0];
    const existed = !!store.expenses[id];
    delete store.expenses[id];
    return { changes: existed ? 1 : 0 };
  }
  if (s.startsWith('INSERT INTO BUDGETS')) {
    const [category, amount, updated_at] = args;
    store.budgets[category] = { category, amount, updated_at };
    return { changes: 1 };
  }
  if (s.startsWith('DELETE FROM BUDGETS')) {
    const cat = args[0];
    const existed = !!store.budgets[cat];
    delete store.budgets[cat];
    return { changes: existed ? 1 : 0 };
  }
  return { changes: 0 };
}

function getSQL(sql, args) {
  const s = sql.trim().toUpperCase();
  if (s.includes('FROM EXPENSES WHERE ID')) {
    return store.expenses[args[0]] || undefined;
  }
  if (s.includes('FROM EXPENSES ORDER BY AMOUNT DESC')) {
    const all = Object.values(store.expenses);
    return all.sort((a, b) => b.amount - a.amount)[0] || null;
  }
  if (s.includes('SUM(AMOUNT)') && s.includes('TOTAL_MONTH')) {
    const [start, end] = args;
    const total = Object.values(store.expenses)
      .filter(e => e.date >= start && e.date <= end)
      .reduce((s, e) => s + e.amount, 0);
    return { total_month: total };
  }
  if (s.includes('FROM BUDGETS WHERE CATEGORY')) {
    return store.budgets[args[0]] || undefined;
  }
  return undefined;
}

function allSQL(sql, args) {
  const s = sql.trim().toUpperCase();

  if (s.includes('FROM EXPENSES WHERE 1=1')) {
    let rows = Object.values(store.expenses);
    // Parse filters from SQL clauses
    let argIdx = 0;
    const upperSql = sql.toUpperCase();
    if (upperSql.includes('AND CATEGORY =')) {
      const cat = args[argIdx++];
      rows = rows.filter(e => e.category === cat);
    }
    if (upperSql.includes('AND DATE >=')) {
      const start = args[argIdx++];
      rows = rows.filter(e => e.date >= start);
    }
    if (upperSql.includes('AND DATE <=')) {
      const end = args[argIdx++];
      rows = rows.filter(e => e.date <= end);
    }
    return rows.sort((a, b) => b.date.localeCompare(a.date));
  }

  if (s.includes('FROM EXPENSES') && s.includes('GROUP BY CATEGORY')) {
    const [start, end] = args;
    const totals = {};
    Object.values(store.expenses)
      .filter(e => e.date >= start && e.date <= end)
      .forEach(e => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
    return Object.entries(totals).map(([category, total]) => ({ category, total }));
  }

  if (s.includes('FROM BUDGETS')) {
    return Object.values(store.budgets);
  }

  return [];
}

module.exports = makeDb;
