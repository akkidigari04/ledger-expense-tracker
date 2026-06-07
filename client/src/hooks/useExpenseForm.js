import { useState } from 'react';
import { today } from '../utils/format';

export const EMPTY_FORM = { amount: '', category: '', date: today(), note: '' };

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

function validate({ amount, category, date }) {
  const errors = {};
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.amount = 'Enter a positive amount';
  }
  if (!category || !CATEGORIES.includes(category)) {
    errors.category = 'Select a valid category';
  }
  if (!date) {
    errors.date = 'Date is required';
  } else if (date > today()) {
    errors.date = 'Date cannot be in the future';
  }
  return errors;
}

export function useExpenseForm(initial = EMPTY_FORM) {
  const [values, setValues]   = useState(initial);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(p => ({ ...p, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    const errs = validate(values);
    setErrors(errs);
  };

  const submit = (onValid) => {
    const errs = validate(values);
    setErrors(errs);
    setTouched({ amount: true, category: true, date: true });
    if (Object.keys(errs).length === 0) {
      onValid({
        amount:   parseFloat(values.amount),
        category: values.category,
        date:     values.date,
        note:     values.note.trim(),
      });
    }
  };

  const reset = (vals = EMPTY_FORM) => {
    setValues(vals);
    setErrors({});
    setTouched({});
  };

  const isValid = Object.keys(validate(values)).length === 0;

  return { values, errors, touched, handleChange, handleBlur, submit, reset, isValid, setValues };
}
