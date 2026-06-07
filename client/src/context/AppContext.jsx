import React, { createContext, useContext, useState, useCallback } from 'react';
import { expensesApi, budgetsApi } from '../api';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [expenses,  setExpenses]  = useState([]);
  const [summary,   setSummary]   = useState(null);
  const [budgets,   setBudgets]   = useState([]);
  const [filters,   setFilters]   = useState({ category: 'All', startDate: '', endDate: '' });
  const [loading,   setLoading]   = useState({ expenses: false, summary: false, budgets: false });
  const [error,     setError]     = useState(null);

  const setLoadingKey = (key, val) => setLoading(p => ({ ...p, [key]: val }));

  const fetchExpenses = useCallback(async (overrideFilters) => {
    const f = overrideFilters ?? filters;
    setLoadingKey('expenses', true);
    setError(null);
    try {
      const res = await expensesApi.list(f);
      setExpenses(res.data);
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoadingKey('expenses', false);
    }
  }, [filters]);

  const fetchSummary = useCallback(async (overrideFilters) => {
    const f = overrideFilters ?? filters;
    setLoadingKey('summary', true);
    try {
      const res = await expensesApi.summary(f);
      setSummary(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKey('summary', false);
    }
  }, [filters]);

  const fetchBudgets = useCallback(async () => {
    setLoadingKey('budgets', true);
    try {
      const res = await budgetsApi.list();
      setBudgets(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKey('budgets', false);
    }
  }, []);

  const fetchAll = useCallback((overrideFilters) => {
    fetchExpenses(overrideFilters);
    fetchSummary(overrideFilters);
    fetchBudgets();
  }, [fetchExpenses, fetchSummary, fetchBudgets]);

  const addExpense = async (data) => {
    const res = await expensesApi.create(data);
    toast.success('Expense added');
    fetchAll();
    return res.data;
  };

  const editExpense = async (id, data) => {
    const res = await expensesApi.update(id, data);
    toast.success('Expense updated');
    fetchAll();
    return res.data;
  };

  const removeExpense = async (id) => {
    await expensesApi.delete(id);
    toast.success('Expense deleted');
    fetchAll();
  };

  const saveBudget = async (category, amount) => {
    await budgetsApi.upsert({ category, amount });
    toast.success(`Budget for ${category} saved`);
    fetchBudgets();
    fetchSummary();
  };

  const removeBudget = async (category) => {
    await budgetsApi.delete(category);
    toast.success(`Budget for ${category} removed`);
    fetchBudgets();
  };

  const applyFilters = (newFilters) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    fetchAll(merged);
  };

  return (
    <AppContext.Provider value={{
      expenses, summary, budgets, filters, loading, error,
      fetchAll, fetchExpenses, fetchSummary, fetchBudgets,
      addExpense, editExpense, removeExpense,
      saveBudget, removeBudget,
      applyFilters,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
