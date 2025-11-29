import React from 'react';
import { motion } from 'framer-motion';

const GoalsCard = ({ goals, onEdit }) => {
    // Helper function to format dates consistently
    const formatDate = (dateStr) => {
        if (!dateStr) return 'No deadline';

        // Try to parse the date
        let date;

        // Handle YYYY-MM-DD format
        if (dateStr.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
            date = new Date(dateStr);
        }
        // Handle YYYY-M format
        else if (dateStr.match(/^\d{4}-\d{1,2}$/)) {
            date = new Date(dateStr + '-01');
        }
        // Handle "MMM YYYY" format
        else if (dateStr.match(/^[A-Za-z]{3}\s\d{4}$/)) {
            date = new Date(dateStr);
        }
        // Fallback: try direct parsing
        else {
            date = new Date(dateStr);
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateStr; // Return original if can't parse
        }

        // Format as "MMM YYYY"
        const options = { month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className="module-list">
            {goals.map((g, i) => (
                <motion.div key={g.id} className="module-item"
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onClick={() => onEdit(g)} style={{ cursor: 'pointer' }}>
                    <div className="module-header">
                        <span className="module-title">{g.name}</span>
                        <span className="module-value">{g.percent}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${g.percent}%`, background: '#EC4899' }}></div>
                    </div>
                    <div className="module-sub">₹{(g.current || 0).toLocaleString()} / ₹{(g.target || 0).toLocaleString()} by {formatDate(g.date)}</div>
                </motion.div>
            ))}
        </div>
    );
};

export default GoalsCard;
