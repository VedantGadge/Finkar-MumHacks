import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Toast.css';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#10B981" />
                        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'error':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#EF4444" />
                        <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 22H22L12 2Z" fill="#F59E0B" />
                        <path d="M12 9V13M12 17H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'info':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#3B82F6" />
                        <path d="M12 16V12M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`toast toast-${type}`}
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <div className="toast-icon">{getIcon()}</div>
                    <span className="toast-message">{message}</span>
                    <button className="toast-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Confirmation Dialog Component
export const ConfirmDialog = ({ isVisible, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="confirm-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                >
                    <motion.div
                        className="confirm-dialog"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`confirm-icon ${type}`}>
                            {type === 'danger' ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 9V13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <h3 className="confirm-title">{title}</h3>
                        <p className="confirm-message">{message}</p>
                        <div className="confirm-actions">
                            <button className="confirm-btn cancel" onClick={onCancel}>
                                {cancelText}
                            </button>
                            <button className={`confirm-btn ${type}`} onClick={onConfirm}>
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Input Dialog Component (replaces browser prompt)
export const InputDialog = ({ isVisible, title, placeholder, onConfirm, onCancel, confirmText = 'Add', cancelText = 'Cancel' }) => {
    const [inputValue, setInputValue] = React.useState('');

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onConfirm(inputValue.trim());
            setInputValue('');
        }
    };

    const handleCancel = () => {
        setInputValue('');
        onCancel();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            handleSubmit();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="confirm-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCancel}
                >
                    <motion.div
                        className="confirm-dialog input-dialog"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="confirm-icon info">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 7H17M7 12H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3 className="confirm-title">{title}</h3>
                        <input
                            type="text"
                            className="input-dialog-field"
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <div className="confirm-actions">
                            <button className="confirm-btn cancel" onClick={handleCancel}>
                                {cancelText}
                            </button>
                            <button 
                                className="confirm-btn primary" 
                                onClick={handleSubmit}
                                disabled={!inputValue.trim()}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Custom hook for toast management
export const useToast = () => {
    const [toast, setToast] = React.useState({ isVisible: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }));
    };

    return { toast, showToast, hideToast };
};

export default Toast;
