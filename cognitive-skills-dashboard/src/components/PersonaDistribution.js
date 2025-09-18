'use client';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function PersonaDistribution({ students }) {
  // Count students in each persona
  const personaCounts = students.reduce((acc, student) => {
    const persona = student.learning_persona;
    acc[persona] = (acc[persona] || 0) + 1;
    return acc;
  }, {});

  // Sort personas numerically (0, 1, 2, 3)
  const sortedPersonas = Object.keys(personaCounts)
    .map(Number)
    .sort((a, b) => a - b);

  const personaLabels = {
    0: 'High Achievers',
    1: 'Balanced Learners',
    2: 'Developing Skills',
    3: 'Needs Support'
  };

  const backgroundColors = [
    'rgba(59, 130, 246, 0.7)',  // Blue
    'rgba(16, 185, 129, 0.7)',  // Green
    'rgba(245, 158, 11, 0.7)',  // Yellow
    'rgba(239, 68, 68, 0.7)',   // Red
  ];

  const borderColors = [
    'rgba(59, 130, 246, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)',
  ];

  const data = {
    labels: sortedPersonas.map(p => personaLabels[p] || `Persona ${p + 1}`),
    datasets: [
      {
        data: sortedPersonas.map(p => personaCounts[p]),
        backgroundColor: sortedPersonas.map(p => backgroundColors[p % backgroundColors.length]),
        borderColor: sortedPersonas.map(p => borderColors[p % borderColors.length]),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} students (${percentage}%)`;
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="h-80">
      <Doughnut data={data} options={options} />
      <div className="mt-2 text-center text-sm text-gray-600">
        Total Students: {students.length}
      </div>
    </div>
  );
}
