import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const IndexChart = ({ data, title = "Index", gradientId = "indexGradient", color = "#047857" }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Responsive values based on screen width
    const chartHeight = windowWidth > 768 ? 500 : windowWidth > 480 ? 350 : 300;
    const marginRight = windowWidth > 480 ? 30 : 10;
    const marginLeft = windowWidth > 480 ? 10 : 5;
    const marginBottom = windowWidth > 480 ? 60 : 40;
    const fontSize = windowWidth > 480 ? '13px' : '10px';
    const strokeWidth = windowWidth > 480 ? 2.5 : 2;

    return (
        <motion.section
            className="nifty50-fullwidth-section"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <div className="nifty50-header">
                <h3>{title} Trend</h3>
                <p className="nifty50-period">Last 1 Month</p>
            </div>
            <div className="nifty50-summary">
                <div className="summary-item">
                    <span className="summary-label">Current</span>
                    <span className="summary-value">
                        ₹{data.summary.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Change</span>
                    <span className={`summary-value ${data.summary.price_change >= 0 ? 'positive' : 'negative'}`}>
                        {data.summary.price_change >= 0 ? '+' : ''}₹{data.summary.price_change.toFixed(2)} ({data.summary.price_change_pct}%)
                    </span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">High</span>
                    <span className="summary-value">
                        ₹{data.summary.high_price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Low</span>
                    <span className="summary-value">
                        ₹{data.summary.low_price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart data={data.data} margin={{ top: 20, right: marginRight, left: marginLeft, bottom: marginBottom }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        style={{ fontSize }}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        style={{ fontSize }}
                        domain={['dataMin - 100', 'dataMax + 100']}
                        tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            padding: '12px'
                        }}
                        labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-IN');
                        }}
                        formatter={(value) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Price']}
                    />
                    <Line
                        type="monotone"
                        dataKey="close"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        dot={false}
                        fill={`url(#${gradientId})`}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.section>
    );
};

export default IndexChart;
