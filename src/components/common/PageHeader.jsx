import React from 'react';

export const PageHeader = ({ title, subtitle, badge, actionButton, children }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {badge && (
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full border border-blue-200">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {(actionButton || children) && (
        <div className="flex items-center gap-3 flex-wrap">{actionButton || children}</div>
      )}
    </div>
  );
};
