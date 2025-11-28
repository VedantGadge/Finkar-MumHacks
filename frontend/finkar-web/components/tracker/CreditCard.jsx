import React from 'react';
import { motion } from 'framer-motion';

const CreditCard = ({ creditCards, onEdit }) => {
    return (
        <div className="module-list">
            {creditCards.map((c, i) => (
                <motion.div key={c.id} className="module-item"
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onClick={() => onEdit(c)} style={{ cursor: 'pointer' }}>
                    <div className="module-header">
                        <span className="module-title">{c.name}</span>
                        <span className="module-value">₹{c.outstanding.toLocaleString()}</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${c.utilization}%`, background: '#8B5CF6' }}></div>
                    </div>
                    <div className="module-sub">Limit: ₹{c.limit.toLocaleString()} • Due: {c.nextDue}</div>
                </motion.div>
            ))}
        </div>
    );
};

export default CreditCard;
