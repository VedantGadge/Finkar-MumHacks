import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const VolumeChart = ({ data }) => {
    const [series, setSeries] = useState([]);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const volumeData = data.map((d, i) => ({
            x: new Date(d.date).getTime(),
            y: d.volume,
            fillColor: (i > 0 && d.close >= data[i - 1].close) ? '#10B981' : '#EF4444'
        }));

        setSeries([{ name: 'Volume', data: volumeData }]);
    }, [data]);

    const options = {
        chart: {
            id: 'volume-chart',
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
            labels: {
                style: { colors: '#9CA3AF', fontSize: '11px' },
                formatter: val => val ? (val / 1000000).toFixed(1) + 'M' : ''
            }
        },
        grid: {
            borderColor: '#F3F4F6',
            strokeDashArray: 0,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } }
        },
        plotOptions: { bar: { columnWidth: '60%', borderRadius: 2 } },
        dataLabels: { enabled: false },
        tooltip: {
            theme: 'light',
            y: { formatter: val => val?.toLocaleString() }
        }
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '12px',
            border: '1px solid #E5E7EB'
        }}>
            <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '8px'
            }}>
                Volume
            </div>
            <ReactApexChart options={options} series={series} type="bar" height={150} />
        </div>
    );
};

export default VolumeChart;
