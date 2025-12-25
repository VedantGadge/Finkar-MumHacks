import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Flashcard.css';

const Flashcard = ({ front, back }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <motion.div
            className="insight-card-container"
            onTap={handleFlip}
        >
            <motion.div
                className="insight-card-inner"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 8 }}
            >
                <div className="insight-card-face insight-card-front">
                    <div className="insight-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                    </div>
                    <p className="insight-question">{front}</p>
                    <span className="insight-hint">Tap to reveal</span>
                </div>

                <div className="insight-card-face insight-card-back">
                    <div className="insight-answer-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22,4 12,14.01 9,11.01" />
                        </svg>
                    </div>
                    <p className="insight-answer">{back}</p>
                    <span className="insight-hint">Tap to flip back</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Flashcard;
