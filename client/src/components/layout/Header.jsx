import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center">
            <span className="font-display text-cream text-base leading-none">₹</span>
          </div>
          <span className="font-display text-xl text-ink">Ledger</span>
        </div>
        <span className="text-xs text-ink/30 hidden sm:block font-body">
          Personal Expense Tracker
        </span>
      </div>
    </header>
  );
}
