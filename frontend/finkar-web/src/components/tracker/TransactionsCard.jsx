import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionsCard = ({ transactions, deleteTransaction, onEdit }) => {
    return (
        <>
            <div className="tracker-table-header">
                <div className="header-cell">Date</div>
                <div className="header-cell">Amount</div>
                <div className="header-cell">Category</div>
            </div>
            <div className="tracker-rows">
                <AnimatePresence>
                    {transactions.map((t, i) => (
                        <div key={t.id} className="swipe-row-container">
                            <motion.div
                                className={`tracker-row ${t.type === 'income' ? 'income-row' : 'expense-row'}`}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0, padding: 0, overflow: 'hidden' }}
                                transition={{ delay: i * 0.05 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={{ left: 0.5, right: 0 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    if (offset.x < -100) {
                                        deleteTransaction(t.id);
                                    }
                                }}
                                onClick={() => onEdit(t)}
                                style={{ position: 'relative', zIndex: 2, cursor: 'pointer' }}
                            >
                                <div className="cell-text date-cell">{t.date}</div>
                                <div className="cell-text amount-cell">₹{parseFloat(t.amount).toLocaleString()}</div>
                                <div className="cell-text category-cell">{t.category}</div>
                            </motion.div>
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
};

export default TransactionsCard;
