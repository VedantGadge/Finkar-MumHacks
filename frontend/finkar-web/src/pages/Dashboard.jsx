import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, PieChartIcon, ChatBubbleIcon, ReaderIcon, BarChartIcon } from '@radix-ui/react-icons';
import { App } from '@capacitor/app';
import useBackButton from '../hooks/useBackButton';
import { useLanguage } from '../contexts/LanguageContext';
import './Dashboard.css';
import Tracker from './Tracker';
import Chatbot from './Chatbot';
import Learning from './Learning';
import Stocks from './Stocks';
import Profile from './Profile';
import { fetchTransactions, fetchBalance } from '../services/transactionsService';
import { fetchGoals } from '../services/goalsService';
import { fetchBudgets } from '../services/budgetService';
import { fetchLiabilities } from '../services/liabilitiesService';
import FinancialHealthCard from '../components/dashboard/FinancialHealthCard';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingObligations from '../components/dashboard/UpcomingObligations';
import RecentActivity from '../components/dashboard/RecentActivity';
import GoalsOverview from '../components/dashboard/GoalsOverview';
import BudgetOverview from '../components/dashboard/BudgetOverview';
import Toast, { useToast, InputDialog } from '../components/common/Toast';

function Dashboard({ onLogout }) {
    const { t } = useLanguage();
    const [checklistItems, setChecklistItems] = useState([
        { id: 1, text: 'Save 20000 for vedant debt', completed: false },
        { id: 2, text: 'EMI payment 20th Nov', completed: false },
        { id: 3, text: 'Jaipur Flight Cost:\n9000\n7000', completed: false }
    ]);

    const [activeTab, setActiveTab] = useState(0);
    const [isSquished, setIsSquished] = useState(false);

    // State for API data
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [budgets, setBudgets] = useState(null);
    const [loans, setLoans] = useState([]);
    const [creditCards, setCreditCards] = useState([]);
    const [apiBalance, setApiBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Toast and Dialog states
    const { toast, showToast, hideToast } = useToast();
    const [showInputDialog, setShowInputDialog] = useState(false);

    // Trigger squish effect when tab changes
    useEffect(() => {
        setIsSquished(true);
        const timer = setTimeout(() => setIsSquished(false), 100);
        return () => clearTimeout(timer);
    }, [activeTab]);

    // Fetch all data on component mount
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                const userId = localStorage.getItem('finkar_user_id') || 1; // Get user ID from localStorage

                // Fetch all data in parallel
                const [transactionsData, goalsData, budgetsData, liabilitiesData, balanceData] = await Promise.all([
                    fetchTransactions(userId).catch(() => ({ transactions: [] })),
                    fetchGoals(userId).catch(() => []),
                    fetchBudgets(userId).catch(() => ({ budgets: [] })),
                    fetchLiabilities(userId).catch(() => ({ loans: [], credit_cards: [] })),
                    fetchBalance(userId).catch(() => ({ balance: null }))
                ]);

                // Map transactions
                const transactionsArray = transactionsData.transactions || [];
                const mappedTransactions = transactionsArray.map(txn => ({
                    id: txn.id,
                    date: txn.transaction_date,
                    desc: txn.narration,
                    type: txn.type === 'CREDIT' ? 'income' : 'expense',
                    amount: txn.amount.toString(),
                    category: txn.category
                }));

                // Map goals
                const goalsArray = Array.isArray(goalsData) ? goalsData : (goalsData.goals || []);
                const mappedGoals = goalsArray.map(goal => {
                    const current = goal.current_amount || 0;
                    const target = goal.target_amount || 1; // Avoid division by zero
                    // Use API's progress_percent if available, otherwise calculate it
                    const percent = goal.progress_percent || (target > 0 ? (current / target) * 100 : 0);

                    return {
                        id: goal.id,
                        name: goal.name,
                        target: goal.target_amount,
                        current: current,
                        date: goal.target_date,
                        percent: percent
                    };
                });

                // Map budgets
                // Budget API returns a summary object, not an array

                // Map liabilities
                const mappedLoans = (liabilitiesData.loans || []).map(loan => ({
                    id: loan.id,
                    name: loan.name,
                    emi: loan.emi_amount,
                    nextDue: loan.next_due_date,
                    principal: loan.principal_amount
                }));

                const mappedCreditCards = (liabilitiesData.credit_cards || []).map(card => ({
                    id: card.id,
                    name: card.card_name,
                    outstanding: card.outstanding_amount,
                    limit: card.limit_amount,
                    nextDue: card.due_date
                }));

                setTransactions(mappedTransactions);
                setGoals(mappedGoals);
                setBudgets(budgetsData);
                setLoans(mappedLoans);
                setCreditCards(mappedCreditCards);
                if (balanceData && balanceData.current_balance !== undefined) {
                    setApiBalance(balanceData.current_balance);
                }
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Calculate financial metrics
    const totalIncome = useMemo(() =>
        transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
        [transactions]
    );

    const totalExpense = useMemo(() =>
        transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
        [transactions]
    );

    const totalBalance = apiBalance !== null ? parseFloat(apiBalance) : (totalIncome - totalExpense);

    const healthScore = useMemo(() => {
        let score = 50;
        if (totalBalance > 0) score += 15;
        if (totalBalance > 50000) score += 10;
        return Math.max(0, Math.min(100, score));
    }, [totalBalance]);

    const upcomingObligations = useMemo(() => {
        const obligations = [];
        const today = new Date();
        const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        loans.forEach(loan => {
            const dueDate = new Date(loan.nextDue);
            if (dueDate >= today && dueDate <= next7Days) {
                obligations.push({
                    type: 'EMI',
                    name: loan.name,
                    amount: loan.emi,
                    date: loan.nextDue
                });
            }
        });

        creditCards.forEach(card => {
            const dueDate = new Date(card.nextDue);
            if (dueDate >= today && dueDate <= next7Days) {
                obligations.push({
                    type: 'Credit Card',
                    name: card.name,
                    amount: card.outstanding,
                    date: card.nextDue
                });
            }
        });

        return obligations.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [loans, creditCards]);

    // Calculate spending by category for pie chart
    const spendingData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};
        let totalExpenses = 0;

        expenses.forEach(txn => {
            const category = txn.category || 'Other';
            const amount = parseFloat(txn.amount || 0);
            categoryTotals[category] = (categoryTotals[category] || 0) + amount;
            totalExpenses += amount;
        });

        // Convert to array and sort by amount
        let categoriesArray = Object.entries(categoryTotals)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount);

        // If more than 4 categories, group the rest into "Others"
        if (categoriesArray.length > 4) {
            const top4 = categoriesArray.slice(0, 4);
            const othersAmount = categoriesArray.slice(4).reduce((sum, cat) => sum + cat.amount, 0);
            categoriesArray = [...top4, { name: 'Others', amount: othersAmount }];
        }

        // Calculate percentages
        const categoriesWithPercent = categoriesArray.map(cat => ({
            ...cat,
            percent: totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0
        }));

        return categoriesWithPercent;
    }, [transactions]);

    // Define colors for pie chart segments
    const categoryColors = ['#047857', '#059669', '#10B981', '#34D399', '#6EE7B7'];


    const toggleComplete = (id) => {
        setChecklistItems(items =>
            items.map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const deleteItem = (id) => {
        setChecklistItems(items => items.filter(item => item.id !== id));
    };

    const addItem = () => {
        setShowInputDialog(true);
    };

    const handleAddChecklistItem = (newText) => {
        const newId = Math.max(...checklistItems.map(i => i.id), 0) + 1;
        setChecklistItems([...checklistItems, { id: newId, text: newText, completed: false }]);
        setShowInputDialog(false);
        showToast('Checklist item added!', 'success');
    };

    // Handle Android back button for tab navigation and app exit
    useBackButton(
        () => {
            if (activeTab === 0) {
                // On home tab, exit the app
                App.exitApp();
            } else {
                // On any other tab, go back to home
                setActiveTab(0);
            }
        },
        0,
        [activeTab]
    );

    // Show profile page
    const [showProfile, setShowProfile] = useState(false);

    if (showProfile) {
        return (
            <Profile
                onLogout={onLogout}
                onBack={() => setShowProfile(false)}
            />
        );
    }

    const renderHome = () => (
        <>
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <motion.h2 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>{t('dashboard.hello')}, Vedant</motion.h2>
                    <motion.p className="header-name" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, delay: 0.06 }}>{t('dashboard.welcomeBack')}</motion.p>
                </div>
                <motion.button
                    className="profile-button"
                    onClick={() => setShowProfile(true)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Profile"
                >
                    <svg className="profile-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4 21C4 17.134 7.58172 14 12 14C16.4183 14 20 17.134 20 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </motion.button>
            </div>

            {/* Financial Health Card */}
            <FinancialHealthCard balance={totalBalance} healthScore={healthScore} />

            {/* Quick Actions */}
            <QuickActions
                onAddTransaction={() => setActiveTab(1)}
                onPayBill={() => showToast('Pay Bill feature coming soon!', 'info')}
                onTrackGoal={() => setActiveTab(1)}
                onAskAI={() => setActiveTab(2)}
            />

            {/* Budget Overview */}
            <BudgetOverview
                budget={budgets}
                onManageBudget={() => setActiveTab(1)}
            />

            {/* Goals Overview */}
            <GoalsOverview
                goals={goals}
                onTrackGoal={() => setActiveTab(1)}
            />

            {/* Spendings Section */}
            <section className="spendings-section">
                <motion.h2 initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>{t('dashboard.yourSpendings')}</motion.h2>
                <div className="spendings-card">
                    <div className="chart-section">
                        <div className="chart-container">
                            <svg viewBox="0 0 200 200" className="pie-chart">
                                {spendingData.length > 0 ? (
                                    <>
                                        {spendingData.map((category, index) => {
                                            const radius = 80;
                                            const circumference = 2 * Math.PI * radius;
                                            const percent = category.percent / 100;

                                            // Calculate offset based on previous segments
                                            const previousPercents = spendingData
                                                .slice(0, index)
                                                .reduce((sum, cat) => sum + (cat.percent / 100), 0);
                                            const offset = -(circumference * previousPercents);

                                            return (
                                                <motion.circle
                                                    key={category.name}
                                                    cx="100"
                                                    cy="100"
                                                    r={radius}
                                                    fill="transparent"
                                                    stroke={categoryColors[index] || '#10B981'}
                                                    strokeWidth="80"
                                                    initial={{ strokeDasharray: `0 ${circumference}`, strokeDashoffset: 0 }}
                                                    animate={{
                                                        strokeDasharray: `${circumference * percent} ${circumference}`,
                                                        strokeDashoffset: offset
                                                    }}
                                                    transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.2 }}
                                                />
                                            );
                                        })}
                                        {/* Center circle */}
                                        <circle cx="100" cy="100" r="40" fill="#FFFFFF" />
                                    </>
                                ) : (
                                    <>
                                        {/* Empty state circle */}
                                        <circle cx="100" cy="100" r="80" fill="transparent" stroke="#E5E7EB" strokeWidth="80" />
                                        <circle cx="100" cy="100" r="40" fill="#FFFFFF" />
                                    </>
                                )}
                            </svg>
                        </div>


                        {/* Legend - Vertical on the right */}
                        <div className="legend">
                            {spendingData.length > 0 ? (
                                spendingData.map((category, index) => (
                                    <motion.div
                                        key={category.name}
                                        className="legend-item"
                                        initial={{ x: 12, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.12 + index * 0.06 }}
                                    >
                                        <span
                                            className="legend-color"
                                            style={{ backgroundColor: categoryColors[index] || '#10B981' }}
                                        ></span>
                                        <span className="legend-text">
                                            {category.name} ({category.percent.toFixed(0)}%)
                                        </span>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div className="legend-item" initial={{ x: 12, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                    <span className="legend-text">{t('dashboard.noSpendingData')}</span>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Tooltip notification - Bottom Right with Bulb */}
                    <div className="savings-tooltip">
                        <div className="tooltip-text">
                            kid's fee due soon, save more on family
                        </div>
                        <div className="bulb-icon">💡</div>
                    </div>

                </div>
            </section>

            {/* Upcoming Obligations */}
            <UpcomingObligations obligations={upcomingObligations} />

            {/* Checklist Section */}
            <section className="checklist-section">
                <div className="checklist-header">
                    <motion.h2 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>{t('dashboard.checklist')}</motion.h2>
                    <motion.button className="add-btn" onClick={addItem} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06 }}>{t('dashboard.addChecklist')}</motion.button>
                </div>

                <div className="checklist-items">
                    {checklistItems.map((item, idx) => (
                        <motion.div key={item.id} className={`checklist-item ${item.completed ? 'completed' : ''}`} initial={{ x: -18, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.08 + idx * 0.04 }}>
                            <span className="item-text">{item.text}</span>
                            <div className="item-actions">
                                <button
                                    className="check-btn"
                                    onClick={() => toggleComplete(item.id)}
                                    aria-label="Complete"
                                >
                                    ✓
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteItem(item.id)}
                                    aria-label="Delete"
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Learning Section */}
            <section className="learning-section">
                <div className="section-header">
                    <motion.h2 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        {t('dashboard.financialMastery')}
                    </motion.h2>
                    <motion.button
                        className="view-all-btn"
                        onClick={() => setActiveTab(3)}
                        initial={{ x: 12, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.06 }}
                    >
                        {t('common.viewAll')} →
                    </motion.button>
                </div>
                <motion.div
                    className="learning-progress-card"
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.08 }}
                >
                    <div className="progress-info">
                        <div className="progress-stats-row">
                            <div className="stat-item">
                                <span className="stat-value">9</span>
                                <span className="stat-label">{t('dashboard.modules')}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">22</span>
                                <span className="stat-label">{t('dashboard.lessons')}</span>
                            </div>
                        </div>
                        <motion.button
                            className="continue-learning-btn"
                            onClick={() => setActiveTab(3)}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('dashboard.continueLearning')}
                        </motion.button>
                    </div>
                </motion.div>
            </section>
        </>
    );

    return (
        <div className="dashboard page-container">
            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />

            {/* Input Dialog for Checklist */}
            <InputDialog
                isVisible={showInputDialog}
                title="Add Checklist Item"
                placeholder="Enter your checklist item..."
                onConfirm={handleAddChecklistItem}
                onCancel={() => setShowInputDialog(false)}
                confirmText="Add"
                cancelText="Cancel"
            />

            {activeTab === 0 && renderHome()}
            {activeTab === 1 && <Tracker />}
            {activeTab === 2 && <Chatbot />}
            {activeTab === 3 && <Learning />}
            {activeTab === 4 && <Stocks />}

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <motion.div
                    className="nav-indicator"
                    animate={{
                        x: activeTab * 100 + '%',
                        scaleX: isSquished ? 0.75 : 1,
                        scaleY: isSquished ? 1.15 : 1
                    }}
                    transition={{
                        x: {
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                            mass: 0.8
                        },
                        scaleX: {
                            type: 'spring',
                            stiffness: 500,
                            damping: 30
                        },
                        scaleY: {
                            type: 'spring',
                            stiffness: 500,
                            damping: 30
                        }
                    }}
                    initial={{ scaleX: 1, scaleY: 1 }}
                />
                <button
                    className={`nav-item ${activeTab === 0 ? 'active' : ''}`}
                    aria-label="Dashboard"
                    onClick={() => setActiveTab(0)}
                >
                    <HomeIcon className="nav-icon" />
                </button>
                <button
                    className={`nav-item ${activeTab === 1 ? 'active' : ''}`}
                    aria-label="Wallet"
                    onClick={() => setActiveTab(1)}
                >
                    <PieChartIcon className="nav-icon" />
                </button>
                <button
                    className={`nav-item ${activeTab === 2 ? 'active' : ''}`}
                    aria-label="Chatbot"
                    onClick={() => setActiveTab(2)}
                >
                    <ChatBubbleIcon className="nav-icon" />
                </button>
                <button
                    className={`nav-item ${activeTab === 3 ? 'active' : ''}`}
                    aria-label="Learning"
                    onClick={() => setActiveTab(3)}
                >
                    <ReaderIcon className="nav-icon" />
                </button>
                <button
                    className={`nav-item ${activeTab === 4 ? 'active' : ''}`}
                    aria-label="Stocks"
                    onClick={() => setActiveTab(4)}
                >
                    <BarChartIcon className="nav-icon" />
                </button>
            </nav>
        </div>
    );
}

export default Dashboard;
