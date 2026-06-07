import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, getMonthRange } from '../../utils/format';
import { useApp } from '../../context/AppContext';

const DATE_PRESETS = [
  { label: 'This month',  fn: () => getMonthRange(0)  },
  { label: 'Last month',  fn: () => getMonthRange(-1) },
  { label: 'Last 3 months', fn: () => {
    const end = new Date().toISOString().split('T')[0];
    const d = new Date(); d.setMonth(d.getMonth() - 3);
    return { startDate: d.toISOString().split('T')[0], endDate: end };
  }},
];

export default function FilterBar() {
  const { filters, applyFilters } = useApp();
  const [open, setOpen] = useState(false);

  const setCategory = (cat) => applyFilters({ ...filters, category: cat });
  const setPreset   = (fn)   => applyFilters({ ...filters, ...fn() });
  const clearFilter = ()     => applyFilters({ category: 'All', startDate: '', endDate: '' });

  const hasActiveFilters =
    filters.category !== 'All' || filters.startDate || filters.endDate;

  return (
    <div className="space-y-3">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 items-center">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filters.category === cat
                ? 'bg-ink text-cream'
                : 'bg-sand/60 text-ink/60 hover:bg-sand'
            }`}
          >
            {cat}
          </button>
        ))}

        {/* Advanced filters toggle */}
        <button
          className={`ml-auto btn-ghost py-1 px-3 text-xs ${open ? 'bg-sand' : ''}`}
          onClick={() => setOpen(v => !v)}
        >
          <SlidersHorizontal size={13} />
          Filters
        </button>

        {hasActiveFilters && (
          <button className="btn-ghost py-1 px-3 text-xs text-clay" onClick={clearFilter}>
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      {/* Expanded date filters */}
      {open && (
        <div className="card p-4 space-y-3 animate-slide-up">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {DATE_PRESETS.map(p => (
              <button
                key={p.label}
                className="px-3 py-1 rounded-full text-xs bg-sand/60 hover:bg-sand text-ink/70"
                onClick={() => setPreset(p.fn)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom range */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="label">From</label>
              <input
                type="date"
                className="input text-sm"
                value={filters.startDate}
                onChange={e => applyFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="label">To</label>
              <input
                type="date"
                className="input text-sm"
                value={filters.endDate}
                onChange={e => applyFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
