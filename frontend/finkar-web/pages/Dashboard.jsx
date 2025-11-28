import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, PieChartIcon, ChatBubbleIcon, ReaderIcon, BarChartIcon } from '@radix-ui/react-icons';
import { App } from '@capacitor/app';
import useBackButton from '../hooks/useBackButton';
import './Dashboard.css';
import Tracker from './Tracker';
import Chatbot from './Chatbot';
import Learning from './Learning';
import Stocks from './Stocks';
import { useFinance } from '../contexts/FinanceContext';
import FinancialHealthCard from '../components/dashboard/FinancialHealthCard';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingObligations from '../components/dashboard/UpcomingObligations';
import RecentActivity from '../components/dashboard/RecentActivity';

function Dashboard() {
    const [checklistItems, setChecklistItems] = useState([
        { id: 1, text: 'Save 20000 for vedant debt', completed: false },
        { id: 2, text: 'EMI payment 20th Nov', completed: false },
        { id: 3, text: 'Jaipur Flight Cost:\n9000\n7000', completed: false }
    ]);

    const [activeTab, setActiveTab] = useState(0);
    const [isSquished, setIsSquished] = useState(false);

    // Trigger squish effect when tab changes
    useEffect(() => {
        setIsSquished(true);
        const timer = setTimeout(() => setIsSquished(false), 100);
        return () => clearTimeout(timer);
    }, [activeTab]);

    // Get finance data from context
    const { transactions, loans, creditCards } = useFinance();

    // Calculate financial metrics
    const totalIncome = useMemo(() =>
        transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
        [transactions]
    );

    const totalExpense = useMemo(() =>
        transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
        [transactions]
    );

    const totalBalance = totalIncome - totalExpense;

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
        const newText = prompt('Enter new checklist item:');
        if (newText && newText.trim()) {
            const newId = Math.max(...checklistItems.map(i => i.id), 0) + 1;
            setChecklistItems([...checklistItems, { id: newId, text: newText.trim(), completed: false }]);
        }
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

    const renderHome = () => (
        <>
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <motion.h2 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>Welcome Back</motion.h2>
                    <motion.p className="header-name" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, delay: 0.06 }}>Welcome, Vedant</motion.p>
                </div>
            </div>

            {/* Financial Health Card */}
            <FinancialHealthCard balance={totalBalance} healthScore={healthScore} />

            {/* Quick Actions */}
            <QuickActions
                onAddTransaction={() => setActiveTab(1)}
                onPayBill={() => alert('Pay Bill feature coming soon!')}
                onTrackGoal={() => setActiveTab(1)}
                onAskAI={() => setActiveTab(2)}
            />

            {/* Upcoming Obligations */}
            <UpcomingObligations obligations={upcomingObligations} />

            {/* Recent Activity */}
            <RecentActivity transactions={transactions} />

            {/* Spendings Section */}
            <section className="spendings-section">
                <motion.h2 initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>Your Spendings</motion.h2>
                <div className="spendings-card">
                    <div className="chart-section">
                        <div className="chart-container">
                            <svg viewBox="0 0 200 200" className="pie-chart">
                                {/* FAMILY – 45% */}
                                <motion.circle
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    fill="transparent"
                                    stroke="#047857"
                                    strokeWidth="80"
                                    initial={{ strokeDasharray: `0 ${2 * Math.PI * 80}` }}
                                    animate={{
                                        strokeDasharray: `${2 * Math.PI * 80 * 0.45} ${2 * Math.PI * 80}`
                                    }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                />

                                {/* DRINKS – 25% */}
                                <motion.circle
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    fill="transparent"
                                    stroke="#059669"
                                    strokeWidth="80"
                                    initial={{ strokeDasharray: `0 ${2 * Math.PI * 80}`, strokeDashoffset: 0 }}
                                    animate={{
                                        strokeDasharray: `${2 * Math.PI * 80 * 0.25} ${2 * Math.PI * 80}`,
                                        strokeDashoffset: -(2 * Math.PI * 80 * 0.45)
                                    }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                />

                                {/* FOOD – 30% */}
                                <motion.circle
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    fill="transparent"
                                    stroke="#10B981"
                                    strokeWidth="80"
                                    initial={{ strokeDasharray: `0 ${2 * Math.PI * 80}`, strokeDashoffset: 0 }}
                                    animate={{
                                        strokeDasharray: `${2 * Math.PI * 80 * 0.30} ${2 * Math.PI * 80}`,
                                        strokeDashoffset: -(2 * Math.PI * 80 * (0.45 + 0.25))
                                    }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                                />

                                {/* Center circle */}
                                <circle cx="100" cy="100" r="40" fill="#FFFFFF" />
                            </svg>
                        </div>


                        {/* Legend - Vertical on the right */}
                        <div className="legend">
                            <motion.div className="legend-item" initial={{ x: 12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.12 }}>
                                <span className="legend-color family"></span>
                                <span className="legend-text">Family</span>
                            </motion.div>
                            <motion.div className="legend-item" initial={{ x: 12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.18 }}>
                                <span className="legend-color drinks"></span>
                                <span className="legend-text">Drinks</span>
                            </motion.div>
                            <motion.div className="legend-item" initial={{ x: 12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.24 }}>
                                <span className="legend-color food"></span>
                                <span className="legend-text">Food</span>
                            </motion.div>
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

            {/* Checklist Section */}
            <section className="checklist-section">
                <div className="checklist-header">
                    <motion.h2 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>Checklist</motion.h2>
                    <motion.button className="add-btn" onClick={addItem} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06 }}>add +</motion.button>
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
                <motion.h2 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>Learning</motion.h2>
                <motion.div className="learning-card" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06 }}>
                    <div className="course-info">
                        <motion.h3 initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.08 }}>Master investing</motion.h3>
                        <motion.button className="continue-btn" initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.12 }}>Continue Learning</motion.button>
                    </div>
                    <motion.div className="instructor-image" initial={{ x: 12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.12 }}>
                        <div className="instructor-placeholder">
                            <div className="instructor-label">Gate<br />Smashers</div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>
        </>
    );

    return (
        <div className="dashboard page-container">
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
