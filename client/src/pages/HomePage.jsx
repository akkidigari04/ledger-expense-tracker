import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import SummaryCards from '../components/dashboard/SummaryCards';
import CategoryChart from '../components/dashboard/CategoryChart';
import BudgetPanel from '../components/dashboard/BudgetPanel';
import ExpenseList from '../components/expenses/ExpenseList';

export default function HomePage() {
  const { fetchAll } = useApp();

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Summary KPIs */}
        <section aria-label="Summary statistics">
          <SummaryCards />
        </section>

        {/* Charts + Budgets */}
        <section aria-label="Analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart />
            <BudgetPanel />
          </div>
        </section>

        {/* Expense list */}
        <section aria-label="Expense list">
          <ExpenseList />
        </section>
      </main>

      <footer className="text-center text-xs text-ink/25 py-8 font-body">
        Ledger · Studio Graphene Assessment
      </footer>
    </div>
  );
}
