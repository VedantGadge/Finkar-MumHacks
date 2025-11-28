import React from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Learning = () => {
    return (
        <div className="learning-page" style={{ padding: '20px', paddingBottom: '80px' }}>
            <motion.h2
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45 }}
            >
                Learning Center
            </motion.h2>

            <motion.div
                className="learning-card"
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.06 }}
                style={{ marginTop: '20px' }}
            >
                <div className="course-info">
                    <motion.h3 initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.08 }}>Master investing</motion.h3>
                    <motion.button className="continue-btn" initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.12 }}>Continue Learning</motion.button>
                </div>
                <motion.div className="instructor-image" initial={{ x: 12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.12 }}>
                    <div className="instructor-placeholder">
                        <div className="instructor-label">Gate<br />Smashers</div>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                className="learning-card"
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                style={{ marginTop: '20px' }}
            >
                <div className="course-info">
                    <h3>Financial Freedom</h3>
                    <button className="continue-btn">Start Course</button>
                </div>
            </motion.div>
        </div>
    );
};

export default Learning;
