import React from 'react';
import { CATEGORIES, today } from '../../utils/format';
import { useExpenseForm, EMPTY_FORM } from '../../hooks/useExpenseForm';

function Field({ label, error, touched, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {touched && error && <p className="mt-1 text-xs text-clay">{error}</p>}
    </div>
  );
}

export default function ExpenseForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }) {
  const { values, errors, touched, handleChange, handleBlur, submit, isValid } =
    useExpenseForm(initial ?? EMPTY_FORM);

  return (
    <div className="space-y-4">
      {/* Amount */}
      <Field label="Amount (₹)" error={errors.amount} touched={touched.amount}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-sm font-mono">₹</span>
          <input
            type="number"
            name="amount"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className={`input pl-7 ${touched.amount && errors.amount ? 'input-error' : ''}`}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
          />
        </div>
      </Field>

      {/* Category */}
      <Field label="Category" error={errors.category} touched={touched.category}>
        <select
          name="category"
          value={values.category}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input ${touched.category && errors.category ? 'input-error' : ''}`}
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      {/* Date */}
      <Field label="Date" error={errors.date} touched={touched.date}>
        <input
          type="date"
          name="date"
          value={values.date}
          onChange={handleChange}
          onBlur={handleBlur}
          max={today()}
          className={`input ${touched.date && errors.date ? 'input-error' : ''}`}
        />
      </Field>

      {/* Note */}
      <Field label="Note (optional)">
        <textarea
          name="note"
          value={values.note}
          onChange={handleChange}
          rows={2}
          maxLength={500}
          placeholder="What was this for?"
          className="input resize-none"
        />
        <p className="text-right text-xs text-ink/30 mt-0.5">{values.note.length}/500</p>
      </Field>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button type="button" className="btn-ghost flex-1 justify-center" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="button"
          className="btn-primary flex-1 justify-center"
          onClick={() => submit(onSubmit)}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
