'use client';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function PerformanceChart({ students }) {
  // Group students by class and calculate average scores
  const classAverages = students.reduce((acc, student) => {
    if (!acc[student.Class]) {
      acc[student.Class] = {
        count: 0,
        totalScore: 0,
        totalComprehension: 0,
        totalAttention: 0,
        totalFocus: 0,
        totalRetention: 0,
      };
    }
    
    acc[student.Class].count += 1;
    acc[student.Class].totalScore += student.assessment_score;
    acc[student.Class].totalComprehension += student.comprehension;
    acc[student.Class].totalAttention += student.attention;
    acc[student.Class].totalFocus += student.focus;
    acc[student.Class].totalRetention += student.retention;
    
    return acc;
  }, {});

  const classes = Object.keys(classAverages).sort();
  
  const data = {
    labels: classes,
    datasets: [
      {
        type: 'line',
        label: 'Avg Assessment Score',
        data: classes.map(cls => (classAverages[cls].totalScore / classAverages[cls].count).toFixed(1)),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Avg Comprehension',
        data: classes.map(cls => (classAverages[cls].totalComprehension / classAverages[cls].count).toFixed(1)),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Avg Attention',
        data: classes.map(cls => (classAverages[cls].totalAttention / classAverages[cls].count).toFixed(1)),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Avg Focus',
        data: classes.map(cls => (classAverages[cls].totalFocus / classAverages[cls].count).toFixed(1)),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        yAxisID: 'y1',
      },
      {
        type: 'bar',
        label: 'Avg Retention',
        data: classes.map(cls => (classAverages[cls].totalRetention / classAverages[cls].count).toFixed(1)),
        backgroundColor: 'rgba(236, 72, 153, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Performance Metrics by Class',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(1) + '%';
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Class',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Assessment Score (%)',
        },
        min: 0,
        max: 100,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Skill Metrics (%)',
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
}
