import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const RSIChart = ({ rsiData, timestamps }) => {
    const [series, setSeries] = useState([]);

    useEffect(() => {
        if (!rsiData || rsiData.length === 0 || !timestamps) return;

        const rsiSeries = rsiData.map((val, i) => ({
            x: timestamps[i],
            y: val
        }));

        setSeries([{ name: 'RSI', data: rsiSeries }]);
    }, [rsiData, timestamps]);

    const options = {
        chart: {
            id: 'rsi-chart',
            toolbar: { show: false },
            zoom: { enabled: false },
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
            min: 0,
            max: 100,
            tickAmount: 4,
            labels: {
                style: { colors: '#9CA3AF', fontSize: '11px' },
                formatter: val => Math.round(val)
            }
        },
        grid: {
            borderColor: '#F3F4F6',
            strokeDashArray: 0,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } }
        },
        annotations: {
            yaxis: [
                { y: 30, borderColor: '#10B981', strokeDashArray: 4, opacity: 0.5 },
                { y: 70, borderColor: '#EF4444', strokeDashArray: 4, opacity: 0.5 }
            ]
        },
        stroke: { width: 2, curve: 'smooth' },
        colors: ['#8B5CF6'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        tooltip: {
            theme: 'light',
            custom: function ({ series, seriesIndex, dataPointIndex }) {
                const value = series[seriesIndex][dataPointIndex];
                return '<div style="padding: 8px 12px; font-size: 13px; font-weight: 500;">' +
                    'RSI: ' + (value ? value.toFixed(1) : '0') +
                    '</div>';
            }
        }
    };

    // Current RSI for status
    const currentRSI = rsiData?.filter(v => v !== null).slice(-1)[0];
    const status = currentRSI > 70 ? 'Overbought' : currentRSI < 30 ? 'Oversold' : 'Neutral';
    const statusColor = currentRSI > 70 ? '#EF4444' : currentRSI < 30 ? '#10B981' : '#6B7280';

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '12px',
            border: '1px solid #E5E7EB'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
            }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                    RSI (14)
                </span>
                {currentRSI && (
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: statusColor,
                        padding: '2px 8px',
                        background: `${statusColor}10`,
                        borderRadius: '4px'
                    }}>
                        {currentRSI.toFixed(1)} · {status}
                    </span>
                )}
            </div>
            <ReactApexChart options={options} series={series} type="area" height={150} />
        </div>
    );
};

export default RSIChart;
