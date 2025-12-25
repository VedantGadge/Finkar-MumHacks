import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { createBudget, updateBudget, deleteBudget, getCurrentUserId } from '../services/budgetService';
import { fetchLiabilities } from '../services/liabilitiesService';
import { fetchGoals, createGoal, deleteGoal } from '../services/goalsService';
import { createManualTransaction, fetchTransactions, fetchBalance } from '../services/transactionsService';
import { useLanguage } from '../contexts/LanguageContext';
import './Tracker.css';
import TransactionsCard from '../components/tracker/TransactionsCard';
import BudgetCard from '../components/tracker/BudgetCard';
import LoansCard from '../components/tracker/LoansCard';
import CreditCard from '../components/tracker/CreditCard';
import GoalsCard from '../components/tracker/GoalsCard';
import CategoriesCard from '../components/tracker/CategoriesCard';
import CustomDatePicker from '../components/common/CustomDatePicker';
import Toast, { ConfirmDialog } from '../components/common/Toast';
import '../components/common/Toast.css';

function Tracker() {
    const { t } = useLanguage();

    // 1. Transactions Data - fetched from API
    const [transactions, setTransactions] = useLocalStorage('tracker_transactions', []);
    const [apiBalance, setApiBalance] = useLocalStorage('tracker_balance', null);

    // Loading and error states for transactions
    const [transactionsLoading, setTransactionsLoading] = useState(() => !localStorage.getItem('tracker_transactions'));
    const [transactionsError, setTransactionsError] = useState(null);

    // 2. Budget Data
    const [budgets, setBudgets] = useLocalStorage('tracker_budgets', [
        { id: 1, category: 'Food', planned: 10000, actual: 8200, month: 'Nov 2025' },
        { id: 2, category: 'Rent', planned: 15000, actual: 15000, month: 'Nov 2025' },
        { id: 3, category: 'Transport', planned: 5000, actual: 2100, month: 'Nov 2025' },
    ]);

    // 3. Loans Data - fetched from API
    const [loans, setLoans] = useLocalStorage('tracker_loans', []);

    // 4. Credit Cards Data - fetched from API
    const [creditCards, setCreditCards] = useLocalStorage('tracker_credit_cards', []);

    // Loading and error states for liabilities
    const [liabilitiesLoading, setLiabilitiesLoading] = useState(() => !localStorage.getItem('tracker_loans') || !localStorage.getItem('tracker_credit_cards'));
    const [liabilitiesError, setLiabilitiesError] = useState(null);

    // 5. Goals Data - fetched from API
    const [goals, setGoals] = useLocalStorage('tracker_goals', []);

    // Loading and error states for goals
    const [goalsLoading, setGoalsLoading] = useState(() => !localStorage.getItem('tracker_goals'));
    const [goalsError, setGoalsError] = useState(null);

    // 6. Categories Data
    // 6. Categories Data
    const [categories, setCategories] = useLocalStorage('tracker_categories', [
        { id: 1, name: 'Food', type: 'expense', color: '#EF4444', active: true },
        { id: 2, name: 'Salary', type: 'income', color: '#10B981', active: true },
        { id: 3, name: 'Transport', type: 'expense', color: '#F59E0B', active: true },
    ]);

    const [expandedCard, setExpandedCard] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [scrollOffset, setScrollOffset] = useState(0);
    // key to force remounting the card stack when needed
    const [stackKey, setStackKey] = useState(0);
    // pointer start position for detecting horizontal swipes (visual drag remains vertical)
    const pointerStart = useRef({ x: 0, y: 0 });

    // Toast notification state
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = useState({ isVisible: false, title: '', message: '', onConfirm: null });

    // Show toast notification
    const showToast = useCallback((message, type = 'success') => {
        setToast({ isVisible: true, message, type });
    }, []);

    // Hide toast notification
    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
    }, []);

    // Show confirmation dialog
    const showConfirm = useCallback((title, message, onConfirm) => {
        setConfirmDialog({ isVisible: true, title, message, onConfirm });
    }, []);

    // Hide confirmation dialog
    const hideConfirm = useCallback(() => {
        setConfirmDialog(prev => ({ ...prev, isVisible: false }));
    }, []);

    // Fetch liabilities data on component mount
    useEffect(() => {
        const loadLiabilities = async () => {
            try {
                setLiabilitiesLoading(true);
                const userId = getCurrentUserId();
                const data = await fetchLiabilities(userId);

                // Map loans data from API to component format (with defensive check)
                const mappedLoans = (data.loans || []).map(loan => ({
                    id: loan.id,
                    name: loan.name,
                    emi: loan.emi_amount,
                    nextDue: loan.next_due_date,
                    principal: loan.principal_amount,
                    remaining: null // API doesn't provide this, can be calculated if needed
                }));

                // Map credit cards data from API to component format (with defensive check)
                const mappedCreditCards = (data.credit_cards || []).map(card => ({
                    id: card.id,
                    name: card.card_name,
                    outstanding: card.outstanding_amount,
                    limit: card.limit_amount,
                    nextDue: card.due_date,
                    utilization: Math.round((card.outstanding_amount / card.limit_amount) * 100)
                }));

                setLoans(mappedLoans);
                setCreditCards(mappedCreditCards);
                setLiabilitiesError(null);
            } catch (error) {
                console.error('Failed to load liabilities:', error);
                setLiabilitiesError(error.message);
            } finally {
                setLiabilitiesLoading(false);
            }
        };

        loadLiabilities();
    }, []);

    // Fetch goals data on component mount
    useEffect(() => {
        const loadGoals = async () => {
            try {
                setGoalsLoading(true);
                const userId = getCurrentUserId();
                const data = await fetchGoals(userId);

                // Handle both array and object responses
                const goalsArray = Array.isArray(data) ? data : (data.goals || []);

                // Map goals data from API to component format
                // API returns: saved, target, percent, deadline
                const mappedGoals = goalsArray.map(goal => {
                    // Handle both old format (current_amount, target_amount) and new format (saved, target)
                    const current = goal.saved ?? goal.current_amount ?? 0;
                    const target = goal.target ?? goal.target_amount ?? 1;
                    const percent = goal.percent ?? goal.progress_percent ?? (target > 0 ? (current / target) * 100 : 0);
                    const deadline = goal.deadline ?? goal.target_date ?? null;

                    return {
                        id: goal.id,
                        name: goal.name,
                        target: target,
                        current: current,
                        date: deadline,
                        percent: percent
                    };
                });

                setGoals(mappedGoals);
                setGoalsError(null);
            } catch (error) {
                console.error('Failed to load goals:', error);
                setGoalsError(error.message);
            } finally {
                setGoalsLoading(false);
            }
        };

        loadGoals();
    }, []);

    // Fetch transactions data on component mount
    useEffect(() => {
        const loadTransactions = async () => {
            try {
                setTransactionsLoading(true);
                const userId = getCurrentUserId();
                const data = await fetchTransactions(userId);

                // Map transactions data from API to component format (with defensive check)
                const transactionsArray = data.transactions || [];
                const mappedTransactions = transactionsArray.map(txn => ({
                    id: txn.id,
                    date: txn.transaction_date,
                    desc: txn.narration,
                    type: txn.type === 'CREDIT' ? 'income' : 'expense',
                    amount: txn.amount.toString(),
                    category: txn.category
                }));

                setTransactions(mappedTransactions);
                setTransactionsError(null);
            } catch (error) {
                console.error('Failed to load transactions:', error);
                setTransactionsError(error.message);
            } finally {
                setTransactionsLoading(false);
            }
        };

        loadTransactions();
    }, []);

    // Fetch balance on component mount
    useEffect(() => {
        const loadBalance = async () => {
            try {
                const userId = getCurrentUserId();
                const data = await fetchBalance(userId);
                if (data && data.current_balance !== undefined) {
                    setApiBalance(data.current_balance);
                }
            } catch (error) {
                console.error('Failed to load balance:', error);
            }
        };
        loadBalance();
    }, []);

    const cards = [
        { id: 'transactions', title: t('tracker.transactions'), subtitle: 'Daily Tracker', color: '#3B82F6', type: 'transactions' },
        { id: 'budget', title: t('tracker.budget'), subtitle: 'Monthly Planner', color: '#10B981', type: 'budget' },
        { id: 'loans', title: t('tracker.loans'), subtitle: 'Active Loans', color: '#F59E0B', type: 'loans' },
        { id: 'credit', title: t('tracker.creditCards'), subtitle: 'Usage & Dues', color: '#8B5CF6', type: 'credit' },
        { id: 'goals', title: t('tracker.goals'), subtitle: 'Savings Targets', color: '#EC4899', type: 'goals' },
        { id: 'categories', title: t('tracker.categories'), subtitle: 'Money Map', color: '#6366F1', type: 'categories' }
    ];

    // Memoized Stats Calculations - only recalculate when data changes
    const totalBalance = useMemo(() => {
        if (apiBalance !== null) return parseFloat(apiBalance);
        return transactions.filter(e => e.type === 'income').reduce((sum, e) => sum + parseFloat(e.amount), 0) -
            transactions.filter(e => e.type === 'expense').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    }, [transactions, apiBalance]);

    const monthlySpending = useMemo(() => {
        return transactions.filter(e => e.type === 'expense').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    }, [transactions]);

    const totalPlanned = useMemo(() => {
        return budgets.reduce((s, b) => s + (b.planned || 0), 0);
    }, [budgets]);

    const totalEmi = useMemo(() => {
        return loans.reduce((s, l) => s + (l.emi || 0), 0);
    }, [loans]);

    const totalOutstanding = useMemo(() => {
        return creditCards.reduce((s, c) => s + (c.outstanding || 0), 0);
    }, [creditCards]);

    const goalsProgressPercent = useMemo(() => {
        return goals.length ? Math.round((goals.reduce((s, g) => s + (g.percent || 0), 0) / goals.length)) : 0;
    }, [goals]);

    const categoriesCount = useMemo(() => {
        return categories.length;
    }, [categories]);

    const openCard = (cardId) => setExpandedCard(cardId);
    const closeCard = () => {
        setExpandedCard(null);
        // reset stack position so cards are visible when returning
        setScrollOffset(0);
        // ensure modal/selection cleared
        setShowModal(false);
        setSelectedItem(null);
        // bump key to force remount of the stack (resolves visibility issues)
        setStackKey(k => k + 1);
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    // Helper to render content based on card type
    const renderExpandedContent = (cardId) => {
        switch (cardId) {
            case 'transactions':
                return <TransactionsCard transactions={transactions} deleteTransaction={deleteTransaction} onEdit={openModal} />;
            case 'budget':
                return <BudgetCard onEdit={openModal} />;
            case 'loans':
                return <LoansCard loans={loans} onEdit={openModal} />;
            case 'credit':
                return <CreditCard creditCards={creditCards} onEdit={openModal} />;
            case 'goals':
                return <GoalsCard goals={goals} onEdit={openModal} />;
            case 'categories':
                return <CategoriesCard categories={categories} transactions={transactions} onEdit={openModal} />;
            default:
                return null;
        }
    };

    // Memoize card variants to prevent recalculation on every render
    const getCardVariants = useMemo(() => {
        return (index) => {
            const relativePosition = index - scrollOffset;
            // adjust spacing so the back (bottom) card is more visible with minimal overlap
            // for cards behind the focus (relativePosition < 0) keep previous behaviour
            // make initial stack denser by reducing positive-side multipliers
            const y = relativePosition < 0
                ? relativePosition * 60 - 120
                : // for cards ahead, use a smaller base multiplier and a modest extra spacing after the 2nd card
                relativePosition * 12 + Math.max(0, relativePosition - 2) * 6;
            // reduce rotation for a cleaner look
            const rotate = relativePosition < 0 ? relativePosition * 6 : relativePosition * 3 - 6;
            // make scale change more subtle so back cards remain readable
            const scale = relativePosition < 0 ? Math.max(0.82, 0.9 - Math.abs(relativePosition) * 0.05) : Math.max(0.88, 1 - relativePosition * 0.02);
            const opacity = relativePosition < -2 ? 0 : 1;
            // give later cards a reasonable zIndex but ensure it's positive
            const zIndex = relativePosition < 0 ? 10 + relativePosition : Math.max(1, 10 - relativePosition);

            return {
                animate: {
                    y,
                    rotate,
                    scale,
                    opacity,
                    zIndex,
                    // Use tween for faster, more predictable animations on mobile
                    transition: { type: "tween", duration: 0.3, ease: "easeOut" }
                },
                hover: {
                    scale: scale + 0.05,
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                    transition: { type: "tween", duration: 0.2, ease: "easeOut" }
                }
            };
        };
    }, [scrollOffset]);

    const getCardStat = (cardId) => {
        switch (cardId) {
            case 'transactions':
                return <div className="card-stat">Balance ₹{totalBalance.toLocaleString()}</div>;
            case 'budget':
                return <div className="card-stat">Planned ₹{totalPlanned.toLocaleString()}</div>;
            case 'loans':
                return <div className="card-stat">EMI ₹{totalEmi.toLocaleString()}</div>;
            case 'credit':
                return <div className="card-stat">Outstanding ₹{totalOutstanding.toLocaleString()}</div>;
            case 'goals':
                return <div className="card-stat">Avg {goalsProgressPercent}%</div>;
            case 'categories':
                return <div className="card-stat">{categoriesCount} categories</div>;
            default:
                return null;
        }
    };

    if (expandedCard) {
        const card = cards.find(c => c.id === expandedCard);
        // Only show add button for cards that support adding new items
        const showAddButton = !['loans', 'credit'].includes(expandedCard);

        return (
            <motion.div className="tracker-container expanded page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="expanded-header">
                    <button className="back-btn" onClick={closeCard}>← Back</button>
                    <h2>{card.title}</h2>
                    {showAddButton && (
                        <button className="add-btn" onClick={() => openModal({})}>+ Add</button>
                    )}
                </div>
                <motion.div className="expanded-content" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    {renderExpandedContent(expandedCard)}
                </motion.div>
                {/* Modal Placeholder */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div className="modal-overlay" onClick={closeModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <motion.div className="modal-content" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                                <div className="modal-header">
                                    <h3>Edit {card.title}</h3>
                                    <button className="modal-close" onClick={closeModal}>✕</button>
                                </div>
                                <div className="modal-body">
                                    {expandedCard === 'transactions' && (
                                        <>
                                            <div className="modal-field">
                                                <label>Type</label>
                                                <div className="modal-row">
                                                    <button className={`type-toggle ${selectedItem.type === 'income' ? 'income' : ''}`} onClick={() => setSelectedItem({ ...selectedItem, type: 'income' })}>Income</button>
                                                    <button className={`type-toggle ${selectedItem.type === 'expense' ? 'expense' : ''}`} onClick={() => setSelectedItem({ ...selectedItem, type: 'expense' })}>Expense</button>
                                                </div>
                                            </div>
                                            <div className="modal-row">
                                                <div className="modal-field half">
                                                    <label>Date</label>
                                                    <CustomDatePicker
                                                        selected={selectedItem.date ? new Date(selectedItem.date) : null}
                                                        onChange={(date) => setSelectedItem({ ...selectedItem, date: date ? date.toISOString().split('T')[0] : '' })}
                                                        placeholderText="Select date"
                                                    />
                                                </div>
                                                <div className="modal-field half">
                                                    <label>Amount (₹)</label>
                                                    <input type="number" className="modal-input" value={selectedItem.amount || ''} onChange={(e) => setSelectedItem({ ...selectedItem, amount: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="modal-field">
                                                <label>Category</label>
                                                <input type="text" className="modal-input" value={selectedItem.category || ''} onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })} />
                                            </div>
                                            <div className="modal-field">
                                                <label>Description</label>
                                                <textarea className="modal-textarea" rows="3" value={selectedItem.desc || ''} onChange={(e) => setSelectedItem({ ...selectedItem, desc: e.target.value })}></textarea>
                                            </div>
                                        </>
                                    )}

                                    {expandedCard === 'budget' && (
                                        <>
                                            <div className="modal-field">
                                                <label>Category</label>
                                                <input
                                                    type="text"
                                                    className="modal-input"
                                                    value={selectedItem.category || ''}
                                                    onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
                                                    disabled={!!selectedItem.category && selectedItem.limit !== undefined}
                                                    placeholder="e.g., Food, Transport, Entertainment"
                                                />
                                            </div>
                                            <div className="modal-row">
                                                <div className="modal-field half">
                                                    <label>Budget Amount (₹)</label>
                                                    <input
                                                        type="number"
                                                        className="modal-input"
                                                        value={selectedItem.limit || selectedItem.amount || ''}
                                                        onChange={(e) => setSelectedItem({ ...selectedItem, limit: e.target.value, amount: e.target.value })}
                                                        placeholder="Enter amount"
                                                    />
                                                </div>
                                                <div className="modal-field half">
                                                    <label>Month (YYYY-MM)</label>
                                                    <input
                                                        type="text"
                                                        className="modal-input"
                                                        value={selectedItem.month || ''}
                                                        onChange={(e) => setSelectedItem({ ...selectedItem, month: e.target.value })}
                                                        placeholder="e.g., 2025-11"
                                                        disabled={!!selectedItem.category && selectedItem.limit !== undefined}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {expandedCard === 'loans' && (
                                        <>
                                            <div className="modal-field">
                                                <label>Loan Name</label>
                                                <input type="text" className="modal-input" value={selectedItem.name || ''} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} />
                                            </div>
                                            <div className="modal-row">
                                                <div className="modal-field half">
                                                    <label>EMI (₹)</label>
                                                    <input type="number" className="modal-input" value={selectedItem.emi || ''} onChange={(e) => setSelectedItem({ ...selectedItem, emi: e.target.value })} />
                                                </div>
                                                <div className="modal-field half">
                                                    <label>Next Due</label>
                                                    <CustomDatePicker
                                                        selected={selectedItem.nextDue ? new Date(selectedItem.nextDue) : null}
                                                        onChange={(date) => setSelectedItem({ ...selectedItem, nextDue: date ? date.toISOString().split('T')[0] : '' })}
                                                        placeholderText="Select due date"
                                                    />
                                                </div>
                                            </div>
                                            <div className="modal-row">
                                                <div className="modal-field half">
                                                    <label>Remaining EMIs</label>
                                                    <input type="number" className="modal-input" value={selectedItem.remaining || ''} onChange={(e) => setSelectedItem({ ...selectedItem, remaining: e.target.value })} />
                                                </div>
                                                <div className="modal-field half">
                                                    <label>Principal (₹)</label>
                                                    <input type="number" className="modal-input" value={selectedItem.principal || ''} onChange={(e) => setSelectedItem({ ...selectedItem, principal: e.target.value })} />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {expandedCard === 'credit' && (
                                        <>
                                            <div className="modal-field">
                                                <label>Card Name</label>
                                                <input type="text" className="modal-input" value={selectedItem.name || ''} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} />
                                            </div>
                                            <div className="modal-row">
                                                <div className="modal-field half">
                                                    <label>Outstanding (₹)</label>
                                                    <input type="number" className="modal-input" value={selectedItem.outstanding || ''} onChange={(e) => setSelectedItem({ ...selectedItem, outstanding: e.target.value })} />
                                                </div>
                                                <div className="modal-field half">
                                                    <label>Limit (₹)</label>
                                                    <input type="number" className="modal-input" value={selectedItem.limit || ''} onChange={(e) => setSelectedItem({ ...selectedItem, limit: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="modal-field">
                                                <label>Next Due Date</label>
                                                <CustomDatePicker
                                                    selected={selectedItem.nextDue ? new Date(selectedItem.nextDue) : null}
                                                    onChange={(date) => setSelectedItem({ ...selectedItem, nextDue: date ? date.toISOString().split('T')[0] : '' })}
                                                    placeholderText="Select due date"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {expandedCard === 'goals' && (
                                        <>
                                            <div className="modal-field">
                                                <label>Goal Name</label>
                                                <input type="text" className="modal-input" value={selectedItem.name || ''} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} />
                                            </div>
                                            <div className="modal-row">
                                                <div className="modal-field half">
                                                    <label>Current (₹)</label>
                                                    <input type="number" className="modal-input" value={selectedItem.current || ''} onChange={(e) => setSelectedItem({ ...selectedItem, current: e.target.value })} />
                                                </div>
                                                <div className="modal-field half">
                                                    <label>Target (₹)</label>
                                                    <input type="number" className="modal-input" value={selectedItem.target || ''} onChange={(e) => setSelectedItem({ ...selectedItem, target: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="modal-field">
                                                <label>Target Date</label>
                                                <CustomDatePicker
                                                    selected={selectedItem.date ? new Date(selectedItem.date) : null}
                                                    onChange={(date) => setSelectedItem({ ...selectedItem, date: date ? date.toISOString().split('T')[0] : '' })}
                                                    placeholderText="Select target date"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {expandedCard === 'categories' && (
                                        <>
                                            <div className="modal-field">
                                                <label>Category Name</label>
                                                <input type="text" className="modal-input" value={selectedItem.name || ''} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} />
                                            </div>
                                            <div className="modal-row">
                                                <div className="modal-field half">
                                                    <label>Type</label>
                                                    <select className="modal-input" value={selectedItem.type || 'expense'} onChange={(e) => setSelectedItem({ ...selectedItem, type: e.target.value })}>
                                                        <option value="income">Income</option>
                                                        <option value="expense">Expense</option>
                                                    </select>
                                                </div>
                                                <div className="modal-field half">
                                                    <label>Color</label>
                                                    <input type="color" className="modal-input" style={{ height: '45px' }} value={selectedItem.color || '#000000'} onChange={(e) => setSelectedItem({ ...selectedItem, color: e.target.value })} />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="modal-footer">
                                        {expandedCard === 'budget' && selectedItem.limit !== undefined && (
                                            <button
                                                className="cancel-btn-modal"
                                                style={{
                                                    backgroundColor: '#EF4444',
                                                    color: 'white',
                                                    marginRight: 'auto'
                                                }}
                                                onClick={() => {
                                                    showConfirm(
                                                        'Delete Budget',
                                                        `Are you sure you want to delete the budget for "${selectedItem.category}"?`,
                                                        async () => {
                                                            hideConfirm();
                                                            try {
                                                                const userId = getCurrentUserId();
                                                                await deleteBudget(
                                                                    selectedItem.category,
                                                                    userId,
                                                                    selectedItem.month
                                                                );
                                                                showToast('Budget deleted successfully!', 'success');
                                                                closeModal();
                                                                setTimeout(() => window.location.reload(), 1500);
                                                            } catch (err) {
                                                                showToast('Failed to delete budget: ' + err.message, 'error');
                                                            }
                                                        }
                                                    );
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {expandedCard === 'goals' && selectedItem.id && (
                                            <button
                                                className="cancel-btn-modal"
                                                style={{
                                                    backgroundColor: '#EF4444',
                                                    color: 'white',
                                                    marginRight: 'auto'
                                                }}
                                                onClick={() => {
                                                    showConfirm(
                                                        'Delete Goal',
                                                        `Are you sure you want to delete the goal "${selectedItem.name}"?`,
                                                        async () => {
                                                            hideConfirm();
                                                            try {
                                                                const userId = getCurrentUserId();
                                                                await deleteGoal(selectedItem.id, userId);
                                                                showToast('Goal deleted successfully!', 'success');
                                                                // Refresh goals list
                                                                const data = await fetchGoals(userId);
                                                                const goalsArray = Array.isArray(data) ? data : (data.goals || []);
                                                                const mappedGoals = goalsArray.map(goal => {
                                                                    const current = goal.saved ?? goal.current_amount ?? 0;
                                                                    const target = goal.target ?? goal.target_amount ?? 1;
                                                                    const percent = goal.percent ?? goal.progress_percent ?? (target > 0 ? (current / target) * 100 : 0);
                                                                    const deadline = goal.deadline ?? goal.target_date ?? null;

                                                                    return {
                                                                        id: goal.id,
                                                                        name: goal.name,
                                                                        target: target,
                                                                        current: current,
                                                                        date: deadline,
                                                                        percent: percent
                                                                    };
                                                                });
                                                                setGoals(mappedGoals);
                                                                closeModal();
                                                            } catch (err) {
                                                                showToast('Failed to delete goal: ' + err.message, 'error');
                                                            }
                                                        }
                                                    );
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                        <button className="cancel-btn-modal" onClick={closeModal}>Cancel</button>
                                        <button className="save-btn-modal" onClick={() => {
                                            if (expandedCard === 'transactions') {
                                                if (selectedItem.id) {
                                                    // Editing existing transaction - update local state
                                                    setTransactions(transactions.map(t => t.id === selectedItem.id ? selectedItem : t));
                                                } else {
                                                    // Creating new transaction - call API
                                                    const handleCreateTransaction = async () => {
                                                        try {
                                                            const userId = getCurrentUserId();
                                                            await createManualTransaction(
                                                                userId,
                                                                parseFloat(selectedItem.amount),
                                                                selectedItem.category,
                                                                selectedItem.desc || '', // narration
                                                                selectedItem.date
                                                            );

                                                            // Refresh transactions list from API
                                                            const data = await fetchTransactions(userId);
                                                            const mappedTransactions = data.transactions.map(txn => ({
                                                                id: txn.id,
                                                                date: txn.transaction_date,
                                                                desc: txn.narration,
                                                                type: txn.type === 'CREDIT' ? 'income' : 'expense',
                                                                amount: txn.amount.toString(),
                                                                category: txn.category
                                                            }));
                                                            setTransactions(mappedTransactions);
                                                            showToast('Transaction saved successfully!', 'success');
                                                        } catch (err) {
                                                            showToast('Failed to save transaction: ' + err.message, 'error');
                                                        }
                                                    };
                                                    handleCreateTransaction();
                                                }
                                            } else if (expandedCard === 'budget') {
                                                // Check if editing existing budget (has limit field from API) or creating new
                                                if (selectedItem.limit !== undefined) {
                                                    // Editing existing budget - call PUT API
                                                    const handleUpdateBudget = async () => {
                                                        try {
                                                            const userId = getCurrentUserId();
                                                            await updateBudget(
                                                                userId,
                                                                selectedItem.category,
                                                                parseFloat(selectedItem.limit || selectedItem.amount),
                                                                selectedItem.month
                                                            );

                                                            showToast('Budget updated successfully!', 'success');
                                                            // Refresh the page to reload budget data
                                                            setTimeout(() => window.location.reload(), 1500);
                                                        } catch (err) {
                                                            showToast('Failed to update budget: ' + err.message, 'error');
                                                        }
                                                    };
                                                    handleUpdateBudget();
                                                } else if (selectedItem.id) {
                                                    // Editing legacy local budget - keep local state
                                                    setBudgets(budgets.map(b => b.id === selectedItem.id ? selectedItem : b));
                                                } else {
                                                    // Creating new budget - call POST API
                                                    const handleCreateBudget = async () => {
                                                        try {
                                                            // Month should already be in YYYY-MM format from the input
                                                            let monthFormatted = selectedItem.month || '';
                                                            if (monthFormatted && !monthFormatted.match(/^\d{4}-\d{2}$/)) {
                                                                // If not in YYYY-MM format, try to convert
                                                                const monthMap = {
                                                                    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                                                                    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                                                                    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                                                                };
                                                                const parts = monthFormatted.split(' ');
                                                                if (parts.length === 2 && monthMap[parts[0]]) {
                                                                    monthFormatted = `${parts[1]}-${monthMap[parts[0]]}`;
                                                                }
                                                            }

                                                            const userId = getCurrentUserId();
                                                            await createBudget(
                                                                userId,
                                                                selectedItem.category,
                                                                parseFloat(selectedItem.limit || selectedItem.amount),
                                                                monthFormatted
                                                            );

                                                            showToast('Budget created successfully!', 'success');
                                                            setTimeout(() => window.location.reload(), 1500);
                                                        } catch (err) {
                                                            showToast('Failed to create budget: ' + err.message, 'error');
                                                        }
                                                    };
                                                    handleCreateBudget();
                                                }
                                            } else if (expandedCard === 'loans') {
                                                if (selectedItem.id) {
                                                    setLoans(loans.map(l => l.id === selectedItem.id ? selectedItem : l));
                                                } else {
                                                    setLoans([...loans, { ...selectedItem, id: Date.now() }]);
                                                }
                                            } else if (expandedCard === 'credit') {
                                                if (selectedItem.id) {
                                                    setCreditCards(creditCards.map(c => c.id === selectedItem.id ? selectedItem : c));
                                                } else {
                                                    setCreditCards([...creditCards, { ...selectedItem, id: Date.now() }]);
                                                }
                                            } else if (expandedCard === 'goals') {
                                                if (selectedItem.id) {
                                                    // Editing existing goal - keep local state for now
                                                    setGoals(goals.map(g => g.id === selectedItem.id ? selectedItem : g));
                                                } else {
                                                    // Creating new goal - call API via service
                                                    const handleCreateGoal = async () => {
                                                        try {
                                                            const userId = getCurrentUserId();
                                                            await createGoal(
                                                                userId,
                                                                selectedItem.name,
                                                                parseFloat(selectedItem.target),
                                                                selectedItem.date
                                                            );

                                                            showToast('Goal created successfully!', 'success');
                                                            // Refresh goals list
                                                            const data = await fetchGoals(userId);
                                                            const goalsArray = Array.isArray(data) ? data : (data.goals || []);
                                                            const mappedGoals = goalsArray.map(goal => {
                                                                const current = goal.saved ?? goal.current_amount ?? 0;
                                                                const target = goal.target ?? goal.target_amount ?? 1;
                                                                const percent = goal.percent ?? goal.progress_percent ?? (target > 0 ? (current / target) * 100 : 0);
                                                                const deadline = goal.deadline ?? goal.target_date ?? null;

                                                                return {
                                                                    id: goal.id,
                                                                    name: goal.name,
                                                                    target: target,
                                                                    current: current,
                                                                    date: deadline,
                                                                    percent: percent
                                                                };
                                                            });
                                                            setGoals(mappedGoals);
                                                        } catch (err) {
                                                            showToast('Failed to create goal: ' + err.message, 'error');
                                                        }
                                                    };
                                                    handleCreateGoal();
                                                }
                                            } else if (expandedCard === 'categories') {
                                                if (selectedItem.id) {
                                                    setCategories(categories.map(c => c.id === selectedItem.id ? selectedItem : c));
                                                } else {
                                                    setCategories([...categories, { ...selectedItem, id: Date.now() }]);
                                                }
                                            }
                                            closeModal();
                                        }}>Save Changes</button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toast Notification */}
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.isVisible}
                    onClose={hideToast}
                />

                {/* Confirmation Dialog */}
                <ConfirmDialog
                    isVisible={confirmDialog.isVisible}
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={hideConfirm}
                    confirmText="Delete"
                    type="danger"
                />
            </motion.div>
        );
    }

    return (
        <motion.div className="tracker-container page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="tracker-header">
                <h2>{t('tracker.title')}</h2>
                <p>Swipe to browse • Tap a card to view</p>
            </div>

            <motion.div key={stackKey} className="card-stack" drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                    // vertical drag controls stack movement (visual drag remains vertical)
                    if (offset.y < -50 || velocity.y < -500) setScrollOffset(prev => Math.min(prev + 1, cards.length - 1));
                    else if (offset.y > 50 || velocity.y > 500) setScrollOffset(prev => Math.max(prev - 1, 0));
                }}
                onPointerDown={(e) => {
                    pointerStart.current = { x: e.clientX, y: e.clientY };
                }}
                onPointerUp={(e) => {
                    const dx = e.clientX - pointerStart.current.x;
                    const dy = e.clientY - pointerStart.current.y;
                    // treat a predominantly horizontal movement as a horizontal swipe
                    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                        if (dx < 0) setScrollOffset(prev => Math.min(prev + 1, cards.length - 1));
                        else setScrollOffset(prev => Math.max(prev - 1, 0));
                    }
                }}>
                {cards.map((card, index) => (
                    <motion.div key={card.id} className="stack-card" style={{ '--card-color': card.color }}
                        variants={getCardVariants(index)} animate="animate" whileHover="hover" whileTap={{ scale: 0.98 }} onClick={() => openCard(card.id)}>
                        <div className="card-content">
                            <h3>{card.title}</h3>
                            <p className="card-subtitle">{card.subtitle}</p>
                            {getCardStat(card.id)}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="card-indicators">
                {cards.map((card, index) => (
                    <motion.div key={card.id} className={`indicator ${index === scrollOffset ? 'active' : ''}`}
                        style={{ backgroundColor: index === scrollOffset ? card.color : '#D1D5DB' }}
                        onClick={() => setScrollOffset(index)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} />
                ))}
            </div>

            <motion.div className="stats-summary" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                {transactionsLoading && !totalBalance && !monthlySpending ? (
                    // Simple loading placeholder matching the stat item layout
                    <>
                        <div className="stat-item loading">
                            <span className="stat-label">{t('dashboard.balance')}</span>
                            <div className="skeleton-text" style={{ height: '32px', width: '120px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginTop: '4px' }}></div>
                        </div>
                        <div className="stat-item loading">
                            <span className="stat-label">{t('common.thisMonth')}</span>
                            <div className="skeleton-text" style={{ height: '32px', width: '100px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginTop: '4px' }}></div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="stat-item">
                            <span className="stat-label">{t('dashboard.balance')}</span>
                            <span className="stat-value balance">₹{totalBalance.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">{t('common.thisMonth')}</span>
                            <span className="stat-value expense">₹{monthlySpending.toLocaleString()}</span>
                        </div>
                    </>
                )}
            </motion.div>

            <motion.div className="recent-preview" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <h3>{t('dashboard.recentActivity')}</h3>
                <div className="preview-list">
                    {transactions.slice(0, 3).map((t, i) => (
                        <motion.div key={t.id} className={`preview-item ${t.type}`}
                            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
                            <div className="preview-info">
                                <span className="preview-category">{t.category}</span>
                                <span className="preview-date">{t.date}</span>
                            </div>
                            <span className="preview-amount">{t.type === 'income' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isVisible={confirmDialog.isVisible}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={hideConfirm}
                confirmText="Delete"
                type="danger"
            />
        </motion.div>
    );
}

export default Tracker;
