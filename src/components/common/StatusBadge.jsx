import React from 'react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || '').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized.includes('approved') || normalized.includes('resolved') || normalized.includes('completed') || normalized.includes('paid')) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium';
  } else if (normalized.includes('pending') || normalized.includes('review') || normalized.includes('submitted')) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200/80 font-medium';
  } else if (normalized.includes('progress') || normalized.includes('assigned') || normalized.includes('active')) {
    styles = 'bg-blue-50 text-blue-700 border-blue-200/80 font-medium';
  } else if (normalized.includes('rejected') || normalized.includes('overdue') || normalized.includes('absent')) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200/80 font-medium';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full border ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {status}
    </span>
  );
};
