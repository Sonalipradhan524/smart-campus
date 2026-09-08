import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useData();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/20',
    error: 'bg-rose-600 text-white shadow-rose-500/20',
    warning: 'bg-amber-600 text-white shadow-amber-500/20',
    info: 'bg-blue-600 text-white shadow-blue-500/20',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />,
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-fade-in px-4">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg border border-white/20 ${bgColors[toast.type] || bgColors.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
      </div>
    </div>
  );
};
