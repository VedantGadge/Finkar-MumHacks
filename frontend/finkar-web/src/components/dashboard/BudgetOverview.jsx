import React from 'react';
import { motion } from 'framer-motion';
import './BudgetOverview.css';

const BudgetOverview = ({ budget, onManageBudget }) => {
    if (!budget || !budget.total_budget) {
        return (
            <motion.section
                className="budget-overview-section"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
            >
                <div className="section-header">
                    <h2>Monthly Budget</h2>
                    <button className="manage-btn" onClick={onManageBudget}>Set Budget</button>
                </div>
                <div className="empty-budget">
                    <p>No budget set for this month.</p>
                </div>
            </motion.section>
        );
    }

    const totalSpent = budget.total_spent || budget.spent || 0;
    const totalBudget = budget.total_budget || budget.budget || 0;
    const percentUsed = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
    const isOver = budget.overall_status === 'over' || totalSpent > totalBudget;

    return (
        <motion.section
            className="budget-overview-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
        >
            <div className="section-header">
                <h2>Monthly Budget</h2>
                <button className="manage-btn" onClick={onManageBudget}>Manage</button>
            </div>

            <div className="budget-card">
                <div className="budget-header">
                    <span className="month-label">{budget.month}</span>
                    <span className={`status-badge ${isOver ? 'over' : 'good'}`}>
                        {isOver ? 'Over Budget' : 'On Track'}
                    </span>
                </div>

                <div className="budget-values">
                    <span className="spent-value">₹{totalSpent.toLocaleString()}</span>
                    <span className="total-value">of ₹{totalBudget.toLocaleString()}</span>
                </div>

                <div className="budget-progress-bg">
                    <motion.div
                        className="budget-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentUsed}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                        style={{ backgroundColor: isOver ? '#EF4444' : '#10B981' }}
                    />
                </div>

                <div className="budget-footer">
                    <span>{percentUsed.toFixed(0)}% used</span>
                    <span>₹{(totalBudget - totalSpent).toLocaleString()} left</span>
                </div>
            </div>
        </motion.section>
    );
};

export default BudgetOverview;
