import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { family: 'Inter', size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 15, 26, 0.95)',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: { family: 'Inter', weight: '600' },
      bodyFont: { family: 'Inter' },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
    },
  },
};

export const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data?.map((d) => d.month) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data?.map((d) => d.revenue) || [],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#6366f1',
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={chartDefaults} />
    </div>
  );
};

export const TopProductsChart = ({ data }) => {
  const chartData = {
    labels: data?.map((d) => d.name?.substring(0, 15)) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data?.map((d) => d.totalRevenue) || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(6, 182, 212, 0.7)',
        ],
        borderColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#06b6d4',
        ],
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={chartDefaults} />
    </div>
  );
};

export const CategoryChart = ({ data }) => {
  const categoryMap = {};
  data?.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: 'rgba(15, 15, 26, 0.5)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...chartDefaults,
    scales: undefined,
    plugins: {
      ...chartDefaults.plugins,
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          padding: 15,
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default { RevenueChart, TopProductsChart, CategoryChart };
