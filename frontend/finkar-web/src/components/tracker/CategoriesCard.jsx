import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const CategoriesCard = ({ categories, transactions = [], onEdit }) => {
    // Calculate spending by category for the pie chart
    const spendingData = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        const expenses = transactions.filter(t => t.type === 'expense');
        const totalExpense = expenses.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        if (totalExpense === 0) return [];

        // Map category names to their definitions for colors (case-insensitive)
        const categoryMap = categories.reduce((acc, cat) => {
            if (cat.name) {
                acc[cat.name.toLowerCase()] = cat;
            }
            return acc;
        }, {});

        // Fallback color palette
        const palette = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];

        const categoryTotals = {};
        expenses.forEach(txn => {
            const catName = txn.category || 'Other';
            categoryTotals[catName] = (categoryTotals[catName] || 0) + parseFloat(txn.amount || 0);
        });

        return Object.entries(categoryTotals)
            .map(([name, amount], index) => {
                const normalizedName = name.toLowerCase();
                // Try to find color in categories, otherwise pick from palette based on index
                const color = categoryMap[normalizedName]?.color || palette[index % palette.length];

                return {
                    name,
                    amount,
                    percent: (amount / totalExpense) * 100,
                    color
                };
            })
            .sort((a, b) => b.amount - a.amount);
    }, [categories, transactions]);

    return (
        <div className="categories-container">
            {/* Pie Chart Section */}
            {spendingData.length > 0 && (
                <div className="chart-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', position: 'relative' }}>
                    <svg viewBox="0 0 200 200" width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                        {spendingData.map((category, index) => {
                            const radius = 70;
                            const circumference = 2 * Math.PI * radius;
                            const percent = category.percent / 100;
                            const previousPercents = spendingData.slice(0, index).reduce((sum, cat) => sum + (cat.percent / 100), 0);
                            const offset = -(circumference * previousPercents);

                            return (
                                <motion.circle
                                    key={category.name}
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    fill="transparent"
                                    stroke={category.color}
                                    strokeWidth="40"
                                    strokeDasharray={`${circumference} ${circumference}`}
                                    strokeDashoffset={offset}
                                    initial={{ strokeDasharray: `0 ${circumference}` }}
                                    animate={{ strokeDasharray: `${circumference * percent} ${circumference}` }}
                                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                                />
                            );
                        })}
                        {/* Inner white circle for donut effect */}
                        <circle cx="100" cy="100" r="50" fill="transparent" />
                    </svg>
                    {/* Center Text */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#6B7280', display: 'block' }}>Total</span>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
                            ₹{spendingData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="module-list">
                {categories.map((c, i) => (
                    <motion.div key={c.id} className="module-item category-item"
                        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                        onClick={() => onEdit(c)} style={{ cursor: 'pointer' }}>
                        <div className="category-swatch" style={{ background: c.color }}></div>
                        <span className="module-title">{c.name}</span>
                        <span className={`category-type ${c.type}`}>{c.type}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesCard;
