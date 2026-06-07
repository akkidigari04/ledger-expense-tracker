import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { CATEGORY_COLORS, formatCurrency } from '../../utils/format';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-ink text-cream text-xs rounded-lg px-3 py-2 shadow-lg font-body">
      <p className="font-medium">{name}</p>
      <p className="font-mono">{formatCurrency(value)}</p>
    </div>
  );
};

export default function CategoryChart() {
  const { summary, loading } = useApp();
  const [view, setView] = useState('pie'); // 'pie' | 'bar'

  if (loading.summary || !summary?.by_category?.length) {
    return (
      <div className="card p-5">
        <div className="h-48 flex items-center justify-center text-sm text-ink/30">
          {loading.summary ? 'Loading…' : 'No data to visualise yet'}
        </div>
      </div>
    );
  }

  const data = summary.by_category.map(d => ({
    name:  d.category,
    value: d.total,
    fill:  CATEGORY_COLORS[d.category] || '#94a3b8',
  }));

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">By Category</h3>
        <div className="flex gap-1 bg-sand/50 rounded-lg p-0.5">
          {['pie', 'bar'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                view === v ? 'bg-white shadow-sm text-ink' : 'text-ink/50'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        {view === 'pie' ? (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#0f0f0f99' }} />
            <YAxis tick={{ fontSize: 11, fill: '#0f0f0f99' }}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-ink/60">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: d.fill }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}
