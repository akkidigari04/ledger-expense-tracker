import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format';
import CategoryBadge from '../ui/CategoryBadge';
import ConfirmDialog from '../ui/ConfirmDialog';
import Modal from '../ui/Modal';
import ExpenseForm from './ExpenseForm';
import { useApp } from '../../context/AppContext';

export default function ExpenseRow({ expense }) {
  const { editExpense, removeExpense } = useApp();
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = async (data) => {
    await editExpense(expense.id, data);
    setEditOpen(false);
  };

  return (
    <>
      <div className="card p-4 flex items-start gap-4 hover:shadow-md transition-shadow animate-fade-in">
        {/* Amount */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-mono font-semibold text-ink text-base">
              {formatCurrency(expense.amount)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                className="btn-ghost p-1.5 rounded-lg text-ink/40 hover:text-sage"
                onClick={() => setEditOpen(true)}
                aria-label="Edit expense"
              >
                <Pencil size={15} />
              </button>
              <button
                className="btn-ghost p-1.5 rounded-lg text-ink/40 hover:text-clay"
                onClick={() => setDeleteOpen(true)}
                aria-label="Delete expense"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={expense.category} />
            <span className="text-xs text-ink/40">{formatDate(expense.date)}</span>
          </div>
          {expense.note && (
            <p className="text-xs text-ink/50 mt-1.5 line-clamp-2">{expense.note}</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Expense">
        <ExpenseForm
          initial={{
            amount:   String(expense.amount),
            category: expense.category,
            date:     expense.date,
            note:     expense.note || '',
          }}
          onSubmit={handleEdit}
          onCancel={() => setEditOpen(false)}
          submitLabel="Update"
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => removeExpense(expense.id)}
        message={`Delete ${formatCurrency(expense.amount)} (${expense.category})?`}
      />
    </>
  );
}
