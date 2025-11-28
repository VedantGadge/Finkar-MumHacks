import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, FileTextIcon, RocketIcon, LightningBoltIcon } from '@radix-ui/react-icons';
import './QuickActions.css';

const QuickActions = ({ onAddTransaction, onPayBill, onTrackGoal, onAskAI }) => {
    const actions = [
        { id: 1, icon: <PlusIcon />, label: 'Add Transaction', onClick: onAddTransaction, color: '#10B981' },
        { id: 2, icon: <FileTextIcon />, label: 'Pay Bill', onClick: onPayBill, color: '#3B82F6' },
        { id: 3, icon: <RocketIcon />, label: 'Track Goal', onClick: onTrackGoal, color: '#8B5CF6' },
        { id: 4, icon: <LightningBoltIcon />, label: 'Ask AI', onClick: onAskAI, color: '#F59E0B' },
    ];

    return (
        <motion.section
            className="quick-actions-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <h2>Quick Actions</h2>
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
