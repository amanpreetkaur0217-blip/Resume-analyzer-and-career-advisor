import React from 'react';

export default function ScoreCard({
  score,
  maxScore = 100,
  label,
  sublabel,
  type = 'number', // 'number' (76/100) or 'percent' (65%)
  color = 'indigo', // 'indigo', 'emerald', 'amber', 'rose'
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));
  
  // Circle metrics
  const radius = 54;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Gradient & color mapping
  const colorSchemes = {
    indigo: {
      gradientStart: '#6366f1',
      gradientEnd: '#4338ca',
      bgTrack: '#e0e7ff',
      textColor: 'text-indigo-600',
    },
    emerald: {
      gradientStart: '#10b981',
      gradientEnd: '#059669',
      bgTrack: '#d1fae5',
      textColor: 'text-emerald-600',
    },
    amber: {
      gradientStart: '#f59e0b',
      gradientEnd: '#d97706',
      bgTrack: '#fef3c7',
      textColor: 'text-amber-600',
    },
    rose: {
      gradientStart: '#f43f5e',
      gradientEnd: '#e11d48',
      bgTrack: '#ffe4e6',
      textColor: 'text-rose-600',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;
  const gradId = `score-grad-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
      {/* SVG Circular Ring */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={scheme.gradientStart} />
              <stop offset="100%" stopColor={scheme.gradientEnd} />
            </linearGradient>
          </defs>
          
          {/* Background Track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke={scheme.bgTrack}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />

          {/* Animated Value Stroke */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {score}
            </span>
            {type === 'number' && (
              <span className="text-sm font-semibold text-slate-400">
                /{maxScore}
              </span>
            )}
            {type === 'percent' && (
              <span className="text-sm font-semibold text-slate-400">
                %
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {sublabel && (
        <p className="text-xs text-slate-500 mt-2 max-w-[180px]">
          {sublabel}
        </p>
      )}
    </div>
  );
}
