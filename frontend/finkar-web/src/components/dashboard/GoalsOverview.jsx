import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import './GoalsOverview.css';

const GoalsOverview = ({ goals, onTrackGoal }) => {
    const { t } = useLanguage();
    
    // Sort goals by progress (closest to completion first) or priority
    // For now, let's just take the first 2 goals
    const displayGoals = goals.slice(0, 2);

    if (!goals || goals.length === 0) {
        return (
            <motion.section
                className="goals-overview-section"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="section-header">
                    <h2>{t('dashboard.yourGoals')}</h2>
                    <button className="see-all-btn" onClick={onTrackGoal}>{t('tracker.addGoal')}</button>
                </div>
                <div className="empty-goals">
                    <p>{t('dashboard.noGoalsYet')}</p>
                </div>
            </motion.section>
        );
    }

    return (
        <motion.section
            className="goals-overview-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="section-header">
                <h2>{t('dashboard.yourGoals')}</h2>
                <button className="see-all-btn" onClick={onTrackGoal}>{t('common.viewAll')}</button>
            </div>

            <div className="goals-list">
                {displayGoals.map((goal, idx) => (
                    <div key={goal.id} className="goal-item">
                        <div className="goal-info">
                            <span className="goal-name">{goal.name}</span>
                            <span className="goal-amount">₹{(goal.current || 0).toLocaleString()} / ₹{(goal.target || 0).toLocaleString()}</span>
                        </div>
                        <div className="goal-progress-bg">
                            <motion.div
                                className="goal-progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(goal.percent, 100)}%` }}
                                transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                                style={{ backgroundColor: goal.percent >= 100 ? '#10B981' : '#3B82F6' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
};

export default GoalsOverview;
