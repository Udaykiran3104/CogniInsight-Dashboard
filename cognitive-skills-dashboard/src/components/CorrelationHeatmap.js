'use client';
import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ChartType,
  ChartTypeRegistry
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Add matrix controller and element
import {
  MatrixController,
  MatrixElement,
} from 'chartjs-chart-matrix';

ChartJS.register(MatrixController, MatrixElement);

export default function CorrelationHeatmap() {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  // Sample correlation data
  const labels = ['Comprehension', 'Attention', 'Focus', 'Retention', 'Engagement', 'Score'];
  const data = [
    [1.0, 0.75, 0.65, 0.82, 0.58, 0.91],
    [0.75, 1.0, 0.85, 0.72, 0.63, 0.78],
    [0.65, 0.85, 1.0, 0.68, 0.71, 0.82],
    [0.82, 0.72, 0.68, 1.0, 0.59, 0.87],
    [0.58, 0.63, 0.71, 0.59, 1.0, 0.65],
    [0.91, 0.78, 0.82, 0.87, 0.65, 1.0],
  ];

  // Create data points for the matrix
  const matrixData = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      matrixData.push({
        x: labels[j],
        y: labels[i],
        v: data[i][j]
      });
    }
  }

  const chartData = {
    datasets: [{
      label: 'Correlation',
      data: matrixData,
      backgroundColor: (context) => {
        const value = context.dataset.data[context.dataIndex].v;
        const alpha = (value + 1) / 2; // Normalize to 0-1 range
        return `rgba(37, 99, 235, ${alpha})`; // Blue gradient
      },
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 1,
      width: ({ chart }) => ((chart.chartArea || {}).width / data[0].length) - 1,
      height: ({ chart }) => ((chart.chartArea || {}).height / data.length) - 1,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: () => '',
          label: (context) => {
            const data = context.dataset.data[context.dataIndex];
            return `${data.y} & ${data.x}: ${data.v.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        offset: true,
        position: 'bottom',
        labels: labels,
        grid: {
          display: false
        },
        ticks: {
          display: true
        }
      },
      y: {
        type: 'category',
        offset: true,
        position: 'left',
        labels: [...labels].reverse(),
        grid: {
          display: false
        },
        ticks: {
          display: true
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Skills Correlation</h2>
      <div style={{ position: 'relative', height: '500px', width: '100%' }}>
        <Chart
          ref={chartRef}
          type="matrix"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
}
