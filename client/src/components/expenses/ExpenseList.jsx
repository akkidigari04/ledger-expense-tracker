import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ExpenseRow from './ExpenseRow';
import FilterBar from './FilterBar';
import Modal from '../ui/Modal';
import ExpenseForm from './ExpenseForm';
import EmptyState from '../ui/EmptyState';
import { SkeletonList } from '../ui/Skeleton';
import { expensesApi } from '../../api';

export default function ExpenseList() {
  const { expenses, loading, addExpense, filters } = useApp();
  const [addOpen, setAddOpen] = useState(false);

  const handleAdd = async (data) => {
    await addExpense(data);
    setAddOpen(false);
  };

  const handleExport = () => {
    const url = expensesApi.exportCSV(filters);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">Expenses</h2>
        <div className="flex gap-2">
          <button className="btn-ghost py-2 px-3" onClick={handleExport} title="Export CSV">
            <Download size={16} />
            <span className="hidden sm:inline text-sm">Export</span>
          </button>
          <button className="btn-primary" onClick={() => setAddOpen(true)}>
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* List */}
      {loading.expenses ? (
        <SkeletonList count={5} />
      ) : expenses.length === 0 ? (
        <EmptyState
          title="No expenses found"
          subtitle="Try adjusting your filters or add a new expense."
        />
      ) : (
        <div className="space-y-2">
          {expenses.map(exp => (
            <ExpenseRow key={exp.id} expense={exp} />
          ))}
          <p className="text-xs text-ink/30 text-center pt-2">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Add modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Expense">
        <ExpenseForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>
    </div>
  );
}
