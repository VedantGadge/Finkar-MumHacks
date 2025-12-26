import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cross2Icon, ChevronLeftIcon, ChevronRightIcon, BarChartIcon, LightningBoltIcon, FileTextIcon } from '@radix-ui/react-icons';
import './MonthlySnapshots.css';

const MonthlySnapshots = ({ snapshots = [], isLoading = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: null, // 'trends' or 'recommendations'
        content: null
    });

    // Variants for simple fade animation
    const variants = {
        enter: {
            opacity: 0
        },
        center: {
            zIndex: 1,
            opacity: 1,
            transition: {
                duration: 0.2
            }
        },
        exit: {
            zIndex: 0,
            opacity: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (modalConfig.isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [modalConfig.isOpen]);

    // Sort snapshots by date (most recent first)
    const sortedSnapshots = [...snapshots].sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1);
        const dateB = new Date(b.year, b.month - 1);
        return dateB - dateA;
    });

    const currentSnapshot = sortedSnapshots[currentIndex];

    // Helper to extract analysis lists
    const getAnalysisContent = (type) => {
        if (!currentSnapshot?.analysis) return [];
        if (type === 'trends') {
            const trends = currentSnapshot.analysis.spending_trends;
            if (!trends) return [];

            // Handle Object (flatten to key-value strings)
            if (typeof trends === 'object' && !Array.isArray(trends)) {
                return Object.entries(trends).flatMap(([key, value]) => {
                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    if (Array.isArray(value)) {
                        return [`${label}:`, ...value.map(v => `  - ${v}`)];
                    }
                    return [`${label}: ${value}`];
                });
            }

            // Handle Array
            if (Array.isArray(trends)) return trends;

            // Handle String
            return [trends];
        }
        if (type === 'recommendations') {
            return currentSnapshot.analysis.recommendations || [];
        }
        return [];
    };

    const openModal = (type) => {
        setModalConfig({
            isOpen: true,
            type,
            content: getAnalysisContent(type)
        });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, type: null, content: null });
    };

    const goToPrevious = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sortedSnapshots.length - 1));
    };

    const goToNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev < sortedSnapshots.length - 1 ? prev + 1 : 0));
    };

    const formatCurrency = (amount) => {
        return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
    };

    const getMonthName = (month) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1];
    };

    const getCategoryColor = (index) => {
        const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
        return colors[index % colors.length];
    };

    if (isLoading) {
        return (
            <section className="monthly-snapshots-section">
                <div className="section-title">
                    <h2>Monthly Insights</h2>
                </div>
                <div className="snapshots-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading insights...</p>
                </div>
            </section>
        );
    }

    if (!snapshots || snapshots.length === 0) {
        return (
            <section className="monthly-snapshots-section">
                <div className="section-title">
                    <h2>Monthly Insights</h2>
                </div>
                <div className="snapshots-empty">
                    <BarChartIcon width={48} height={48} color="#9CA3AF" />
                    <p>No snapshots available</p>
                    <span className="empty-subtext">Your monthly financial insights will appear here</span>
                </div>
            </section>
        );
    }

    // Determine what content to show in the "Categories" slot
    // Priority: Top Categories > Goals > Budgets
    let listContent = { title: 'Top Categories', items: [] };
    let listType = 'categories'; // 'categories', 'goals', 'budgets', 'empty'

    if (currentSnapshot.metrics.top_categories?.length > 0) {
        listContent.title = 'Top Categories';
        listContent.items = currentSnapshot.metrics.top_categories.slice(0, 3);
        listType = 'categories';
    } else if (currentSnapshot.metrics.goals?.items?.length > 0) {
        listContent.title = 'Top Goals';
        listContent.items = currentSnapshot.metrics.goals.items.slice(0, 3);
        listType = 'goals';
    } else if (currentSnapshot.metrics.budgets?.items?.length > 0) {
        listContent.title = 'Budget Watch';
        listContent.items = currentSnapshot.metrics.budgets.items.slice(0, 3);
        listType = 'budgets';
    } else {
        listType = 'empty';
    }

    const maxAmount = listType === 'categories'
        ? (listContent.items[0]?.amount || 1)
        : listType === 'goals'
            ? (listContent.items.reduce((max, item) => Math.max(max, item.target_amount), 0) || 1)
            : (listContent.items.reduce((max, item) => Math.max(max, item.limit), 0) || 1);

    return (
        <section className="monthly-snapshots-section">
            <div className="section-title">
                <h2>Monthly Insights</h2>
                <div className="snapshot-nav-dots">
                    {sortedSnapshots.map((_, idx) => (
                        <span
                            key={idx}
                            className={`nav-dot ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>
            </div>

            {/* Carousel Container */}
            <div className="snapshot-carousel-container">
                <button className="carousel-arrow prev" onClick={goToPrevious} aria-label="Previous month">
                    <ChevronLeftIcon width={24} height={24} />
                </button>

                <div className="carousel-wrapper" style={{ flex: 1, overflow: 'hidden' }}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="snapshot-card"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x;

                                if (swipe < -50) {
                                    goToNext();
                                } else if (swipe > 50) {
                                    goToPrevious();
                                }
                            }}
                        >
                            {/* Header */}
                            <div className="snapshot-header">
                                <div className="month-selector">
                                    <span className="current-month">
                                        {getMonthName(currentSnapshot.month)} {currentSnapshot.year}
                                    </span>
                                </div>
                                <div className={`net-savings ${currentSnapshot.metrics.net_savings >= 0 ? 'positive' : 'negative'}`}>
                                    {currentSnapshot.metrics.net_savings >= 0 ? '+' : ''}{formatCurrency(currentSnapshot.metrics.net_savings)}
                                </div>
                            </div>

                            {/* Main Stats */}
                            <div className="main-stats">
                                <div className="stat-block">
                                    <span className="stat-label">Income</span>
                                    <span className="stat-value income">{formatCurrency(currentSnapshot.metrics.total_income)}</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-block">
                                    <span className="stat-label">Expense</span>
                                    <span className="stat-value expense">{formatCurrency(currentSnapshot.metrics.total_expense)}</span>
                                </div>
                            </div>

                            <div className="savings-rate-container">
                                <span className="sr-label">Savings Rate</span>
                                <span className={`sr-value ${currentSnapshot.metrics.savings_rate >= 0 ? 'positive' : 'negative'}`}>
                                    {currentSnapshot.metrics.savings_rate.toFixed(1)}%
                                </span>
                            </div>

                            {/* Dynamic List Section (Categories/Goals/Budgets) */}
                            <div className="categories-section">
                                <h4>{listContent.title}</h4>
                                <div className="categories-list">
                                    {listType === 'categories' && listContent.items.map((cat, idx) => (
                                        <div key={cat.category} className="category-row">
                                            <div className="cat-info">
                                                <span className="cat-name">{cat.category}</span>
                                                <div className="progress-bg">
                                                    <motion.div
                                                        className="progress-fill"
                                                        style={{ backgroundColor: getCategoryColor(idx) }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(cat.amount / maxAmount) * 100}%` }}
                                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="cat-amount">{formatCurrency(cat.amount)}</span>
                                        </div>
                                    ))}

                                    {listType === 'goals' && listContent.items.map((goal, idx) => (
                                        <div key={goal.name} className="category-row">
                                            <div className="cat-info">
                                                <span className="cat-name">{goal.name}</span>
                                                <div className="progress-bg">
                                                    <motion.div
                                                        className="progress-fill"
                                                        style={{ backgroundColor: getCategoryColor(idx) }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${goal.progress_percent}%` }}
                                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="cat-amount">{goal.progress_percent.toFixed(0)}%</span>
                                        </div>
                                    ))}

                                    {listType === 'budgets' && listContent.items.map((budget, idx) => (
                                        <div key={budget.category} className="category-row">
                                            <div className="cat-info">
                                                <span className="cat-name">{budget.category}</span>
                                                <div className="progress-bg">
                                                    <motion.div
                                                        className="progress-fill"
                                                        style={{ backgroundColor: getCategoryColor(idx), opacity: budget.status === 'exceeded' ? 0.5 : 1 }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(budget.utilization_percent, 100)}%` }}
                                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="cat-amount">{budget.utilization_percent.toFixed(0)}%</span>
                                        </div>
                                    ))}

                                    {listType === 'empty' && (
                                        <p className="no-data-text" style={{ fontSize: '0.9rem', color: '#6B7280', fontStyle: 'italic' }}>
                                            No specific breakdown available for this month.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="analysis-actions">
                                <button className="action-button" onClick={() => openModal('trends')} onPointerDownCapture={e => e.stopPropagation()}>
                                    <BarChartIcon className="btn-icon" />
                                    <span>Trends</span>
                                </button>
                                <button className="action-button" onClick={() => openModal('recommendations')} onPointerDownCapture={e => e.stopPropagation()}>
                                    <LightningBoltIcon className="btn-icon" />
                                    <span>Advice</span>
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button className="carousel-arrow next" onClick={goToNext} aria-label="Next month">
                    <ChevronRightIcon width={24} height={24} />
                </button>
            </div>

            {/* Analysis Modal */}
            {createPortal(
                <AnimatePresence>
                    {modalConfig.isOpen && (
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                        >
                            <motion.div
                                className="modal-content"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "tween", duration: 0.3, ease: "circOut" }}
                                style={{ willChange: 'transform' }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h3>
                                        {modalConfig.type === 'trends' ? 'Spending Trends' : 'Recommendations'}
                                    </h3>
                                    <button className="close-btn" onClick={closeModal}>
                                        <Cross2Icon width={20} height={20} />
                                    </button>
                                </div>

                                <div className="modal-body">
                                    {currentSnapshot.analysis?.summary && (
                                        <div className="modal-summary">
                                            <p>{currentSnapshot.analysis.summary}</p>
                                        </div>
                                    )}
                                    <ul className="modal-list">
                                        {modalConfig.content?.map((item, idx) => (
                                            <li key={idx}>
                                                <span className="list-bullet">•</span>
                                                <span className="list-text" style={{ whiteSpace: 'pre-wrap' }}>{item}</span>
                                            </li>
                                        )) || <li>No data available</li>}
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
};

export default MonthlySnapshots;
