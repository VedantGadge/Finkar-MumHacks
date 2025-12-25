import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const CandlestickChart = ({ data, title }) => {
    const [chartSeries, setChartSeries] = useState([]);

    useEffect(() => {
        if (data && data.length > 0) {
            const formattedData = data.map(item => ({
                x: new Date(item.date).getTime(),
                y: [item.open, item.high, item.low, item.close]
            }));

            setChartSeries([{
                data: formattedData
            }]);
        }
    }, [data]);

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
            toolbar: {
                show: false
            },
            background: 'transparent'
        },
        title: {
            text: title,
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: 'Inter, sans-serif',
                color: '#111827'
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            labels: {
                style: {
                    colors: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                },
                formatter: (value) => {
                    return value.toFixed(0);
                }
            }
        },
        grid: {
            borderColor: '#E5E7EB',
            strokeDashArray: 4,
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#10B981',
                    downward: '#EF4444'
                }
            }
        },
        theme: {
            mode: 'light'
        }
    };

    return (
        <div className="candlestick-chart-container" style={{ width: '100%', marginTop: '20px', padding: '16px', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div id="chart">
                <ReactApexChart options={options} series={chartSeries} type="candlestick" height={350} />
            </div>
        </div>
    );
};

export default CandlestickChart;
