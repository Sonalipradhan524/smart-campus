import React from 'react';
import { CheckCircle2, Clock, XCircle, Circle } from 'lucide-react';

export const RequestTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="py-2">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Request Progress Timeline</h4>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.map((item, idx) => {
          let icon = <Circle className="w-5 h-5 text-slate-300 bg-white" />;
          let textColor = 'text-slate-500';

          if (item.status === 'completed') {
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white" />;
            textColor = 'text-slate-900 font-bold';
          } else if (item.status === 'current') {
            icon = <Clock className="w-5 h-5 text-teal-600 bg-white animate-pulse" />;
            textColor = 'text-teal-700 font-bold';
          } else if (item.status === 'rejected') {
            icon = <XCircle className="w-5 h-5 text-rose-600 bg-white" />;
            textColor = 'text-rose-700 font-bold';
          }

          return (
            <div key={idx} className="relative flex items-start justify-between text-xs">
              <div className="absolute -left-6 top-0 bg-white rounded-full">{icon}</div>
              <div>
                <p className={textColor}>{item.step}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
