import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const FinanceContext = createContext();

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance must be used within FinanceProvider');
    }
    return context;
};

export const FinanceProvider = ({ children }) => {
    // Transactions Data
    const [transactions, setTransactions] = useLocalStorage('tracker_transactions', [
        { id: 1, date: '2023-11-24', desc: 'Grocery Shopping', type: 'expense', amount: '2500', category: 'Food' },
        { id: 2, date: '2023-11-23', desc: 'Uber to office', type: 'expense', amount: '450', category: 'Transport' },
        { id: 3, date: '2023-11-20', desc: 'Freelance Payment', type: 'income', amount: '15000', category: 'Salary' },
    ]);

    // Budget Data
    const [budgets, setBudgets] = useLocalStorage('tracker_budgets', [
        { id: 1, category: 'Food', planned: 10000, actual: 8200, month: 'Nov 2025' },
        { id: 2, category: 'Rent', planned: 15000, actual: 15000, month: 'Nov 2025' },
        { id: 3, category: 'Transport', planned: 5000, actual: 2100, month: 'Nov 2025' },
    ]);

    // Loans Data
    const [loans, setLoans] = useLocalStorage('tracker_loans', [
        { id: 1, name: 'Bike Loan', emi: 4500, nextDue: '2025-12-05', remaining: 12, principal: 120000 },
        { id: 2, name: 'Education Loan', emi: 8000, nextDue: '2025-12-10', remaining: 24, principal: 500000 },
    ]);

    // Credit Cards Data
    const [creditCards, setCreditCards] = useLocalStorage('tracker_creditCards', [
        { id: 1, name: 'HDFC Millennia', outstanding: 23000, limit: 100000, nextDue: '2025-12-10', utilization: 23 },
        { id: 2, name: 'SBI SimplySave', outstanding: 5000, limit: 50000, nextDue: '2025-12-15', utilization: 10 },
    ]);

    // Goals Data
    const [goals, setGoals] = useLocalStorage('tracker_goals', [
        { id: 1, name: 'Emergency Fund', current: 30000, target: 100000, date: 'Dec 2026', percent: 30 },
        { id: 2, name: 'New iPhone', current: 20000, target: 80000, date: 'Mar 2026', percent: 25 },
    ]);

    // Categories Data
    const [categories, setCategories] = useLocalStorage('tracker_categories', [
        { id: 1, name: 'Food', type: 'expense', color: '#EF4444', active: true },
        { id: 2, name: 'Salary', type: 'income', color: '#10B981', active: true },
        { id: 3, name: 'Transport', type: 'expense', color: '#F59E0B', active: true },
    ]);

    const value = {
        transactions,
        setTransactions,
        budgets,
        setBudgets,
        loans,
        setLoans,
        creditCards,
        setCreditCards,
        goals,
        setGoals,
        categories,
        setCategories,
    };

    return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
