import React, { useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, CATEGORIES, CATEGORY_COLORS } from '../../utils/format';

function BudgetRow({ category, budgetAmount, spent, onRemove }) {
  const pct = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;
  const over = spent > budgetAmount;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: CATEGORY_COLORS[category] }}
          />
          <span className="text-sm text-ink">{category}</span>
          {over && <AlertCircle size={13} className="text-clay" />}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono ${over ? 'text-clay font-semibold' : 'text-ink/50'}`}>
            {formatCurrency(spent)} / {formatCurrency(budgetAmount)}
          </span>
          <button
            className="text-ink/30 hover:text-clay transition-colors"
            onClick={() => onRemove(category)}
            aria-label={`Remove ${category} budget`}
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="h-1.5 bg-sand rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-clay' : 'bg-sage'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function BudgetPanel() {
  const { budgets, summary, saveBudget, removeBudget } = useApp();
  const [category, setCategory] = useState('');
  const [amount, setAmount]   = useState('');
  const [error, setError]     = useState('');

  const categorySpend = (cat) =>
    summary?.by_category?.find(b => b.category === cat)?.total || 0;

  const setBudgetMap = Object.fromEntries(budgets.map(b => [b.category, b.amount]));
  const unbundgetedCats = CATEGORIES.filter(c => !setBudgetMap[c]);

  const handleAdd = () => {
    if (!category) return setError('Select a category');
    if (!amount || Number(amount) <= 0) return setError('Enter a positive amount');
    setError('');
    saveBudget(category, Number(amount));
    setCategory('');
    setAmount('');
  };

  return (
    <div className="card p-5 space-y-5">
      <h3 className="font-display text-lg text-ink">Budgets</h3>

      {/* Existing budgets */}
      {budgets.length > 0 ? (
        <div className="space-y-4">
          {budgets.map(b => (
            <BudgetRow
              key={b.category}
              category={b.category}
              budgetAmount={b.amount}
              spent={categorySpend(b.category)}
              onRemove={removeBudget}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink/40">No budgets set. Add one below.</p>
      )}

      {/* Add budget */}
      {unbundgetedCats.length > 0 && (
        <div className="pt-3 border-t border-sand space-y-2">
          <p className="text-xs text-ink/40 uppercase tracking-wide font-medium">Add Budget</p>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="input flex-1 text-sm"
            >
              <option value="">Category…</option>
              {unbundgetedCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              min="1"
              placeholder="₹"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input w-28 text-sm font-mono"
            />
            <button className="btn-sage px-3" onClick={handleAdd} aria-label="Add budget">
              <Plus size={16} />
            </button>
          </div>
          {error && <p className="text-xs text-clay">{error}</p>}
        </div>
      )}
    </div>
  );
}
