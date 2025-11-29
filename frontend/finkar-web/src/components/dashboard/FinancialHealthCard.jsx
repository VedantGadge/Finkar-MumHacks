import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import './FinancialHealthCard.css';

const FinancialHealthCard = ({ balance, healthScore }) => {
    const { t } = useLanguage();
    
    // Safely handle balance value
    const safeBalance = isNaN(balance) || balance === undefined ? 0 : balance;
    const safeHealthScore = isNaN(healthScore) || healthScore === undefined ? 50 : healthScore;

    // Determine status based on health score
    const getStatusInfo = () => {
        if (safeHealthScore >= 80) return { text: t('dashboard.excellent') || 'Excellent', color: '#10B981', emoji: '🚀' };
        if (safeHealthScore >= 60) return { text: t('dashboard.good') || 'Good', color: '#F59E0B', emoji: '👍' };
        if (safeHealthScore >= 40) return { text: t('dashboard.fair') || 'Fair', color: '#EF4444', emoji: '⚠️' };
        return { text: t('dashboard.needsAttention') || 'Needs Attention', color: '#DC2626', emoji: '⚡' };
    };

    const status = getStatusInfo();

    return (
        <motion.section
            className="financial-health-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2>{t('dashboard.financialHealth')}</h2>
            <div className="health-card">
                <div className="health-left">
                    <div className="balance-info">
                        <span className="balance-label">{t('dashboard.totalBalance')}</span>
                        <span className="balance-amount">₹{safeBalance.toLocaleString()}</span>
                    </div>
                    <div className="health-status" style={{ color: status.color }}>
                        <span className="status-emoji">{status.emoji}</span>
                        <span className="status-text">{status.text}</span>
                    </div>
                </div>
                <div className="health-right">
                    <div className="score-circle" style={{ borderColor: status.color }}>
                        <span className="score-number">{safeHealthScore}</span>
                        <span className="score-label">/100</span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default FinancialHealthCard;
