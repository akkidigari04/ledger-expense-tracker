import React from 'react';
import { Receipt } from 'lucide-react';

export default function EmptyState({ title = 'No expenses yet', subtitle = 'Add your first expense to get started.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-sage-pale flex items-center justify-center mb-4">
        <Receipt size={28} className="text-sage" />
      </div>
      <h3 className="font-display text-lg text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink/50 max-w-xs">{subtitle}</p>
    </div>
  );
}
