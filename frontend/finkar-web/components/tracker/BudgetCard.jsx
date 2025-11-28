import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchBudgets } from '../../services/budgetService';

const BudgetCard = ({ onEdit }) => {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBudgets = async () => {
        try {
            setLoading(true);
            const data = await fetchBudgets(1); // user_id hardcoded as 1
            setBudgetData(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching budgets:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBudgets();
    }, []);

    if (loading) {
        return (
            <div className="module-list">
                <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                    Loading budget data...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="module-list">
                <div style={{ textAlign: 'center', padding: '20px', color: '#EF4444' }}>
                    Error: {error}
                </div>
            </div>
        );
    }

    if (!budgetData || !budgetData.categories || budgetData.categories.length === 0) {
        return (
            <div className="module-list">
                <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                    No budget data available
                </div>
            </div>
        );
    }

    return (
        <div className="module-list">
            {/* Overall Budget Summary */}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0 }}
                style={{
                    padding: '16px 20px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #E5E7EB'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '8px'
                }}>
                    <span style={{ fontSize: '16px', color: '#1F2937', fontWeight: '700' }}>
                        Overall Budget
                    </span>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                        {budgetData.overall_status === 'over'
                            ? 'Over Budget'
                            : 'On Track'}
                    </span>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                }}>
                    <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
                        {budgetData.month}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937' }}>
                        ₹{budgetData.total_spent.toLocaleString()} / ₹{budgetData.total_budget.toLocaleString()}
                    </span>
                </div>
                <div style={{
                    height: '4px',
                    background: '#F3F4F6',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${Math.min((budgetData.total_spent / budgetData.total_budget) * 100, 100)}%`,
                            background: budgetData.overall_status === 'over' ? '#EF4444' : '#10B981',
                            transition: 'width 0.5s ease'
                        }}
                    ></div>
                </div>
            </motion.div>

            {/* Category Budgets */}
            {budgetData.categories.map((category, i) => (
                <motion.div
                    key={i}
                    className="module-item"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: (i + 1) * 0.05 }}
                    onClick={() => onEdit(category)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="module-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="module-title">{category.category}</span>
                            {category.status === 'over' && (
                                <span style={{ fontSize: '16px' }}>⚠</span>
                            )}
                        </div>
                        <span className="module-value">
                            ₹{category.spent.toLocaleString()} / ₹{category.limit.toLocaleString()}
                        </span>
                    </div>
                    <div style={{
                        height: '4px',
                        background: '#F3F4F6',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${Math.min(category.percent_used, 100)}%`,
                                background: category.status === 'over' ? '#EF4444' : category.color,
                                transition: 'width 0.5s ease'
                            }}
                        ></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default BudgetCard;
