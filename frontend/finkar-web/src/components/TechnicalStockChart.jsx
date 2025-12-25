import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const TechnicalStockChart = ({ data, indicators, title }) => {
    const [priceSeries, setPriceSeries] = useState([]);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const timestamps = data.map(d => new Date(d.date).getTime());

        const candles = data.map((d, i) => ({
            x: timestamps[i],
            y: [d.open, d.high, d.low, d.close]
        }));

        const mainChartData = [{ name: 'Price', type: 'candlestick', data: candles }];

        if (indicators?.sma20) {
            mainChartData.push({ name: 'SMA 20', type: 'line', data: indicators.sma20.map((val, i) => ({ x: timestamps[i], y: val })) });
        }
        if (indicators?.sma50) {
            mainChartData.push({ name: 'SMA 50', type: 'line', data: indicators.sma50.map((val, i) => ({ x: timestamps[i], y: val })) });
        }
        if (indicators?.bb) {
            mainChartData.push({ name: 'Upper Band', type: 'line', data: indicators.bb.upper.map((val, i) => ({ x: timestamps[i], y: val })) });
            mainChartData.push({ name: 'Lower Band', type: 'line', data: indicators.bb.lower.map((val, i) => ({ x: timestamps[i], y: val })) });
        }

        setPriceSeries(mainChartData);
    }, [data, indicators]);

    const options = {
        chart: {
            id: 'price-chart',
            toolbar: { show: false },
            zoom: { enabled: true, type: 'x', autoScaleYaxis: true },
            animations: { enabled: false },
            fontFamily: 'DM Sans, sans-serif'
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: { colors: '#9CA3AF', fontSize: '11px' },
                datetimeFormatter: { month: "MMM 'yy", day: 'dd MMM' }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: '#9CA3AF', fontSize: '11px' },
                formatter: val => val ? val.toFixed(0) : ''
            },
            tooltip: { enabled: true }
        },
        grid: {
            borderColor: '#F3F4F6',
            strokeDashArray: 0,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } }
        },
        stroke: {
            width: [1, 1.5, 1.5, 1, 1],
            dashArray: [0, 0, 0, 4, 4],
            colors: ['transparent', '#3B82F6', '#F59E0B', '#D1D5DB', '#D1D5DB']
        },
        colors: ['transparent', '#3B82F6', '#F59E0B', '#D1D5DB', '#D1D5DB'],
        legend: {
            show: false
        },
        plotOptions: {
            candlestick: {
                colors: { upward: '#10B981', downward: '#EF4444' },
                wick: { useFillColor: true }
            }
        },
        tooltip: {
            theme: 'light',
            style: { fontSize: '12px' }
        }
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #E5E7EB'
        }}>
            <ReactApexChart options={options} series={priceSeries} type="candlestick" height={350} />
        </div>
    );
};

export default TechnicalStockChart;
