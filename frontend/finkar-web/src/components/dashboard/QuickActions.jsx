import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import './QuickActions.css';

const QuickActions = ({ onAddTransaction, onPayBill, onTrackGoal, onAskAI }) => {
    const { t } = useLanguage();
    
    const actions = [
        {
            id: 1,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            ),
            label: t('dashboard.addTransaction'),
            onClick: onAddTransaction,
            color: '#10B981'
        },
        {
            id: 2,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            ),
            label: t('dashboard.payBill'),
            onClick: onPayBill,
            color: '#3B82F6'
        },
        {
            id: 3,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            ),
            label: t('dashboard.trackGoal'),
            onClick: onTrackGoal,
            color: '#8B5CF6'
        },
        {
            id: 4,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <line x1="9" y1="10" x2="15" y2="10"></line>
                    <line x1="12" y1="7" x2="12" y2="13"></line>
                </svg>
            ),
            label: t('dashboard.askAI'),
            onClick: onAskAI,
            color: '#F59E0B'
        },
    ];

    return (
        <motion.section
            className="quick-actions-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <h2>{t('dashboard.quickActions')}</h2>
            <div className="actions-grid">
                {actions.map((action, idx) => (
                    <motion.button
                        key={action.id}
                        className="action-btn"
                        onClick={action.onClick}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15 + idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ borderColor: action.color }}
                    >
                        <div className="action-icon" style={{ color: action.color }}>
                            {action.icon}
                        </div>
                        <span className="action-label">{action.label}</span>
                    </motion.button>
                ))}
            </div>
        </motion.section>
    );
};

export default QuickActions;
