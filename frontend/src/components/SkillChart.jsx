import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import { PieChart, BarChart3, Layers } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

export default function SkillChart({ matchedCount = 0, missingCount = 0, categoryScores = {} }) {
  const [activeView, setActiveView] = useState('distribution'); // 'distribution' | 'categories'

  // 1. Doughnut Chart Data (Matched vs Missing) - Matching reference image
  const doughnutData = {
    labels: ['Matched', 'Missing'],
    datasets: [
      {
        data: [matchedCount, missingCount],
        backgroundColor: [
          '#3b82f6', // Bright Blue (Matched)
          '#a855f7', // Purple (Missing)
        ],
        hoverBackgroundColor: ['#2563eb', '#9333ea'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
        cutout: '72%',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          font: {
            family: 'Inter, sans-serif',
            size: 11,
            weight: '500',
          },
          padding: 12,
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Inter', size: 12, weight: '600' },
        bodyFont: { family: 'Inter', size: 11 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const total = matchedCount + missingCount;
            const val = context.raw || 0;
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return ` ${context.label}: ${val} skills (${pct}%)`;
          },
        },
      },
    },
  };

  // 2. Bar Chart Data (Category Scores)
  const catKeys = Object.keys(categoryScores);
  const barData = {
    labels: catKeys.map((k) => categoryScores[k].label || k),
    datasets: [
      {
        label: 'Earned Score',
        data: catKeys.map((k) => categoryScores[k].score || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderRadius: 6,
      },
      {
        label: 'Max Points',
        data: catKeys.map((k) => categoryScores[k].max || 0),
        backgroundColor: 'rgba(226, 232, 240, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 10, font: { size: 10, family: 'Inter' } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 8,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 9, family: 'Inter' }, maxRotation: 20 },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 9 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      
      {/* Header and Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            {activeView === 'distribution' ? 'Skills Distribution' : 'Category Performance'}
          </h3>
          <p className="text-xs text-slate-400">
            {activeView === 'distribution' ? 'Required skills matched vs gap' : 'Score breakdown across criteria'}
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveView('distribution')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeView === 'distribution'
                ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Ratio</span>
          </button>
          <button
            onClick={() => setActiveView('categories')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeView === 'categories'
                ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Criteria</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-44 w-full flex items-center justify-center pt-2">
        {activeView === 'distribution' ? (
          <div className="h-full w-full">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        ) : (
          <div className="h-full w-full">
            <Bar data={barData} options={barOptions} />
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total Required: <strong className="text-slate-800">{matchedCount + missingCount}</strong></span>
        <span>Match Ratio: <strong className="text-indigo-600">{matchedCount + missingCount > 0 ? Math.round((matchedCount / (matchedCount + missingCount)) * 100) : 0}%</strong></span>
      </div>

    </div>
  );
}
