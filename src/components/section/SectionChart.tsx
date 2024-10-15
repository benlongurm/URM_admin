import React from 'react';
import { Box } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

type ChartData = {
    [key: string]: number[];
};

interface SectionChartProps {
    title?: string;
    chartType: 'bar_vertical' | 'bar_horizontal' | 'bar_vertical_stacked' | 'line' |'bubble_group';
    legend?: string[];
    categories: string[];
    data: ChartData;
}

const getColor = (index: number): string => {
    const colors = [
        'rgba(42, 56, 82, 0.4)',
        'rgba(42, 56, 82, 0.6)',
        'rgba(42, 56, 82, 0.8)',
        'rgba(42, 56, 82, 1)',
    ];
    return colors[index % colors.length];
};

const SectionChart: React.FC<SectionChartProps> = ({ title, chartType, legend, categories, data }) => {
    const barChartData = {
        labels: categories,
        datasets: Object.keys(data).map((key, index) => ({
            label: key,
            data: data[key],
            backgroundColor: `rgba(42, 56, 82, 0.${index * 2 + 3})`,
            borderColor: `rgba(42, 56, 82, 1)`,
            borderWidth: 1,
        })),
    };

    const barStackedChartData = {
        labels: categories,
        datasets: legend?.map((label, index) => {
            return{
            label: label,
            data: categories.map(category => data?.[category]?.[index]),
            backgroundColor: getColor(index),};
        }) || [],
    };

    const lineChartData = {
        labels: categories,
        datasets: [
            {
                label: legend?.[0],
                data: data.FREQUENCY,
                borderColor: 'rgba(42, 56, 82, 1)',
                backgroundColor: 'rgba(42, 56, 82, 0.2)',
                fill: true,
            },
            {
                label: legend?.[1],
                data: data.SEVERITY,
                borderColor: 'rgba(42, 56, 82, 0.6)',
                backgroundColor: 'rgba(42, 56, 82, 0.2)',
                fill: true,
            },
        ],
    };

    const bar_vertical_options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const, // Ensuring the type is correct
            },
            title: {
                display: false,
                text: title,
            },
        },
    };

    const bar_horizontal_options = {
        indexAxis: 'y' as 'x' | 'y',
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            title: {
                display: false,
                text: title,
            },
        },
    };

    const bar_horizontal_stacked_options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
                text: title,
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                beginAtZero: true,
            },
        },
    };

    const line_options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            title: {
                display: false,
                text: title,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Category',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <Box sx={{ mb: 4 }}>
            {chartType === 'bar_vertical' && <Bar data={barChartData} options={bar_vertical_options} />}
            {chartType === 'bar_horizontal' && <Bar data={barChartData} options={bar_horizontal_options} />}
            {chartType === 'bar_vertical_stacked' && <Bar data={barStackedChartData} options={bar_horizontal_stacked_options} />}
            {chartType === 'line' && <Line data={lineChartData} options={line_options} plugins={[ChartDataLabels]} />}
        </Box>
    );
};

export default SectionChart;
