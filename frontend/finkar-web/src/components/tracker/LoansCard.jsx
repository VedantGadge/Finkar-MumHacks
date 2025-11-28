import React from 'react';
import { motion } from 'framer-motion';

const LoansCard = ({ loans, onEdit }) => {
    return (
        <div className="module-list">
            {loans.map((l, i) => (
                <motion.div key={l.id} className="module-item"
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onClick={() => onEdit(l)} style={{ cursor: 'pointer' }}>
                    <div className="module-header">
                        <span className="module-title">{l.name}</span>
                        <span className="module-value">EMI: ₹{l.emi.toLocaleString()}</span>
                    </div>
                    <div className="module-sub">
                        Due: {l.nextDue}
                        {l.remaining && ` • ${l.remaining} EMIs left`}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default LoansCard;
