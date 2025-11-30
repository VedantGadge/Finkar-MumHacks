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
        if (safeHealthScore >= 80) return { text: t('dashboard.excellent') || 'Excellent', color: '#059669', bg: '#ECFDF5' };
        if (safeHealthScore >= 60) return { text: t('dashboard.good') || 'Good', color: '#D97706', bg: '#FFFBEB' };
        if (safeHealthScore >= 40) return { text: t('dashboard.fair') || 'Fair', color: '#DC2626', bg: '#FEF2F2' };
        return { text: t('dashboard.needsAttention') || 'Needs Attention', color: '#DC2626', bg: '#FEF2F2' };
    };

    const status = getStatusInfo();

    // SVG Circle calculations
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (safeHealthScore / 100) * circumference;

    return (
        <motion.section
            className="financial-health-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="section-header">
                <h2>{t('dashboard.financialHealth')}</h2>
            </div>
            
            <div className="health-card">
                <div className="health-left">
                    <div className="balance-info">
                        <span className="balance-label">{t('dashboard.totalBalance')}</span>
                        <span className="balance-amount">₹{safeBalance.toLocaleString()}</span>
                    </div>
                    <div className="health-status-badge" style={{ color: status.color, backgroundColor: status.bg }}>
                        <span className="status-text">{status.text}</span>
                    </div>
                </div>
                
                <div className="health-right">
                    <div className="score-container">
                        <svg className="score-ring" width="88" height="88">
                            <circle
                                className="score-ring-bg"
                                stroke="#F3F4F6"
                                strokeWidth="6"
                                fill="transparent"
                                r={radius}
                                cx="44"
                                cy="44"
                            />
                            <circle
                                className="score-ring-progress"
                                stroke={status.color}
                                strokeWidth="6"
                                strokeDasharray={circumference + ' ' + circumference}
                                style={{ strokeDashoffset }}
                                strokeLinecap="round"
                                fill="transparent"
                                r={radius}
                                cx="44"
                                cy="44"
                            />
                        </svg>
                        <div className="score-content">
                            <span className="score-number" style={{ color: '#111827' }}>{safeHealthScore}</span>
                            <span className="score-label">/100</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default FinancialHealthCard;
