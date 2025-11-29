import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import './UpcomingObligations.css';

const UpcomingObligations = ({ obligations }) => {
    const { t } = useLanguage();
    
    if (obligations.length === 0) {
        return (
            <motion.section
                className="obligations-section"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2>{t('dashboard.upcomingObligations')}</h2>
                <div className="obligations-empty">
                    <span>{t('dashboard.noUpcoming')} 🎉</span>
                </div>
            </motion.section>
        );
    }

    return (
        <motion.section
            className="obligations-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h2>{t('dashboard.upcomingObligations')}</h2>
            <div className="obligations-list">
                {obligations.map((obligation, idx) => {
                    const daysUntilDue = Math.ceil((new Date(obligation.date) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                        <motion.div
                            key={idx}
                            className="obligation-item"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.25 + idx * 0.05 }}
                        >
                            <div className="obligation-info">
                                <span className="obligation-type">{obligation.type}</span>
                                <span className="obligation-name">{obligation.name}</span>
                            </div>
                            <div className="obligation-details">
                                <span className="obligation-amount">₹{obligation.amount.toLocaleString()}</span>
                                <span className="obligation-due">
                                    {daysUntilDue === 0 ? t('common.today') : daysUntilDue === 1 ? t('dashboard.tomorrow') || 'Tomorrow' : `${daysUntilDue} ${t('dashboard.days') || 'days'}`}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
};

export default UpcomingObligations;
