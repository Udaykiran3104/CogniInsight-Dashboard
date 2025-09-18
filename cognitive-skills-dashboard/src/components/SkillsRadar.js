'use client';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function SkillsRadar({ student }) {
  if (!student) return <div className="text-gray-500 text-center p-4">No student selected</div>;

  const data = {
    labels: ['Comprehension', 'Attention', 'Focus', 'Retention', 'Engagement Time'],
    datasets: [
      {
        label: 'Skills Assessment',
        data: [
          student.Comprehension || 0,
          student.Attention || 0,
          student.Focus || 0,
          student.Retention || 0,
          (student['Engagement Time'] || 0) / 1.8, // Scale to 0-100
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
          color: '#6B7280',
        },
        pointLabels: {
          color: '#4B5563',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            if (label) {
              const value = context.raw;
              if (context.dataIndex === 4) {
                // Convert normalized engagement time back to minutes
                const minutes = Math.round((value / 100) * 180);
                return `${label}: ${minutes} min`;
              }
              return `${label}: ${value.toFixed(1)}%`;
            }
            return '';
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="h-80 text-gray-800">
      <div className="text-center mb-4">
        <p className="text-lg font-semibold">{student.Name}</p>
        <p className="text-sm text-gray-600">Class: {student.Class}</p>
        <p className="text-sm text-gray-600">
          Assessment Score: <span className="font-medium">{student.assessment_score.toFixed(1)}%</span>
        </p>
      </div>
      <Radar data={data} options={options} />
    </div>
  );
}
