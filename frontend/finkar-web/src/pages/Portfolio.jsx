import React, { useState, useEffect } from 'react';
import { getPortfolioSummary, getPortfolioHistory } from '../services/userService';
import './Portfolio.css';
import {
    MagnifyingGlassIcon,
    ReaderIcon,
    ChevronDownIcon
} from '@radix-ui/react-icons';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const Portfolio = ({ isEmbedded = false, embeddedUsername = null, onStockSelect = null }) => {
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState([]);
    const [period] = useState('Month');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = embeddedUsername || localStorage.getItem('finkar_username') || 'Vedant';
                const [summaryData, historyData] = await Promise.all([
                    getPortfolioSummary(username),
                    getPortfolioHistory(username, '1M')
                ]);
                setSummary(summaryData);
                setHistory(historyData);
            } catch (error) {
                console.error('Failed to load portfolio data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [period, embeddedUsername]);

    const renderChart = () => {
        if (!history || history.length === 0) return null;

        // Custom Tooltip
        const CustomTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                return (
                    <div className="custom-tooltip" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <p className="tooltip-date" style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                            {new Date(label).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="tooltip-value" style={{ margin: '4px 0 0', fontWeight: 'bold', color: '#10B981' }}>
                            ₹{payload[0].value.toLocaleString()}
                        </p>
                    </div>
                );
            }
            return null;
        };

        return (
            <div className="chart-area" style={{ height: '220px', width: '100%', marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={history}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#9CA3AF' }}
                            tickFormatter={(date) => new Date(date).getDate()}
                            interval={5}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 10, fill: '#9CA3AF' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="close"
                            stroke="#10B981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    };

    if (isLoading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className={`portfolio-page ${isEmbedded ? 'embedded-portfolio' : 'page-container'}`} style={isEmbedded ? { padding: 0, background: 'transparent' } : {}}>
            {!isEmbedded && (
                <div className="portfolio-header-section">
                    <div className="portfolio-nav">
                        <h1>Portfolio</h1>
                        <div className="nav-actions">
                            <button className="icon-btn"><MagnifyingGlassIcon /></button>
                            <button className="icon-btn"><ReaderIcon /></button>
                        </div>
                    </div>
                </div>
            )}

            <div className="portfolio-content-card">
                {/* Balance Card */}
                <div className="balance-card">
                    <div className="balance-header">
                        <span className="balance-label">Available Balance</span>
                        <button className="period-select">
                            {period} <ChevronDownIcon />
                        </button>
                    </div>
                    <div className="main-balance">
                        ₹{(summary?.availableBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        {/* <small>.00</small> - if needed split for design */}
                    </div>

                    {renderChart()}

                    {/* <div className="chart-dates">
                           Recharts handles axes, so we remove manual dates 
                    </div> */}

                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-header" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                <div className="stat-icon-wrapper spent">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                                </div>
                                <span className="stat-label-text">Invested</span>
                            </div>
                            <span className="stat-amount">₹{(summary?.totalInvested ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                <div className="stat-icon-wrapper earned">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 7L17 17M17 17V7M17 17H7" /></svg>
                                </div>
                                <span className="stat-label-text">Realized P&L</span>
                            </div>
                            <span className="stat-amount">₹{(summary?.totalEarnings ?? 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Top Stock */}
                <div className="top-stock-section" style={{ marginTop: '30px' }}>
                    <div className="section-header">
                        <h3>Top Stock</h3>
                        <button className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                    </div>

                    <div className="stock-list">
                        {(summary?.portfolio || []).map((stock, idx) => (
                            <div
                                key={idx}
                                className="portfolio-stock-item"
                                onClick={() => onStockSelect && onStockSelect(stock.ticker)}
                                style={{ cursor: onStockSelect ? 'pointer' : 'default' }}
                            >
                                <div className="stock-info-left">
                                    <div className="stock-logo">{stock.ticker.substring(0, 2)}</div>
                                    <div className="stock-names">
                                        <h4>{stock.ticker}</h4>
                                        <span>{stock.quantity} Shares</span>
                                    </div>
                                </div>
                                <div className="stock-info-right">
                                    <span className="stock-value">₹{(stock.currentValue || 0).toLocaleString()}</span>
                                    <span className="stock-change positive">+2.5%</span> {/* Mock change for now */}
                                </div>
                            </div>
                        ))}
                        {(!summary?.portfolio || summary.portfolio.length === 0) && (
                            <p style={{ color: '#999', fontSize: '14px' }}>No stocks in portfolio yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
