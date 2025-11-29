import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import './RecentActivity.css';

const RecentActivity = ({ transactions }) => {
    const { t } = useLanguage();
    const recentTransactions = transactions.slice(0, 5);

    return (
        <motion.section
            className="recent-activity-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <h2>{t('dashboard.recentActivity')}</h2>
            <div className="activity-list">
                {recentTransactions.map((transaction, idx) => (
                    <motion.div
                        key={transaction.id}
                        className={`activity-item ${transaction.type}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.35 + idx * 0.05 }}
                    >
                        <div className="activity-info">
                            <span className="activity-category">{transaction.category}</span>
                            <span className="activity-desc">{transaction.desc}</span>
                            <span className="activity-date">{transaction.date}</span>
                        </div>
                        <span className={`activity-amount ${transaction.type}`}>
                            {transaction.type === 'income' ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString()}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};

export default RecentActivity;
