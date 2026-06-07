import React from 'react';
import { TrendingUp, Layers, Award } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format';
import { useApp } from '../../context/AppContext';
import { SkeletonStat } from '../ui/Skeleton';

function StatCard({ icon: Icon, label, value, sub, accent = 'sage' }) {
  const accentMap = { sage: 'bg-sage-pale text-sage', clay: 'bg-clay-pale text-clay' };
  return (
    <div className="card p-5 space-y-3 animate-scale-in">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accentMap[accent]}`}>
          <Icon size={16} />
        </div>
        <span className="text-xs text-ink/50 uppercase tracking-wide font-medium">{label}</span>
      </div>
      <div>
        <div className="font-mono text-2xl font-semibold text-ink leading-none">{value}</div>
        {sub && <div className="text-xs text-ink/40 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { summary, loading } = useApp();

  if (loading.summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <SkeletonStat key={i} />)}
      </div>
    );
  }

  if (!summary) return null;

  const topCategory = summary.by_category.length
    ? summary.by_category.reduce((a, b) => (a.total > b.total ? a : b))
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={TrendingUp}
        label="This month"
        value={formatCurrency(summary.total_month)}
        accent="sage"
      />
      <StatCard
        icon={Layers}
        label="Top category"
        value={topCategory ? topCategory.category : '—'}
        sub={topCategory ? formatCurrency(topCategory.total) : 'No data yet'}
        accent="sage"
      />
      <StatCard
        icon={Award}
        label="Highest expense"
        value={summary.highest_expense ? formatCurrency(summary.highest_expense.amount) : '—'}
        sub={summary.highest_expense
          ? `${summary.highest_expense.category} · ${formatDate(summary.highest_expense.date)}`
          : 'No data yet'}
        accent="clay"
      />
    </div>
  );
}
