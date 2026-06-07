// Currency formatting — uses INR locale by default (assessment context)
export const formatCurrency = (amount, locale = 'en-IN', currency = 'INR') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 })
    .format(amount);

// Date helpers
export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(dateStr + 'T00:00:00'));

export const today = () => new Date().toISOString().split('T')[0];

export const getMonthRange = (offset = 0) => {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
  return { startDate: start, endDate: end };
};

// Category meta
export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export const CATEGORY_COLORS = {
  Food:          '#f59e0b',
  Transport:     '#60a5fa',
  Bills:         '#a78bfa',
  Entertainment: '#f472b6',
  Other:         '#94a3b8',
};

export const CATEGORY_DOT = {
  Food:          'cat-food',
  Transport:     'cat-transport',
  Bills:         'cat-bills',
  Entertainment: 'cat-entertainment',
  Other:         'cat-other',
};
