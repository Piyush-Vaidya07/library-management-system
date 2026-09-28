import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-600',
      accent: 'from-blue-500 to-indigo-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      accent: 'from-emerald-500 to-teal-600'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-600',
      accent: 'from-amber-500 to-orange-600'
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-600',
      accent: 'from-rose-500 to-pink-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-600',
      accent: 'from-purple-500 to-indigo-600'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.bg} ${scheme.text} border ${scheme.border}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {subtitle && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {trend && (
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
