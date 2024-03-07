// LineChartComponent.tsx
import { CategoryScale, Chart as ChartJS, ChartOptions, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartModel } from '../model/ChartModel';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

interface LineChartComponentProps {
  data: ChartModel[];
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = {
    labels: sortedData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Votes Gained',
        data: sortedData.map(d => d.votes_gained),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Votes Gained Over Time',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM D, YYYY',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Votes Gained',
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default LineChartComponent;
