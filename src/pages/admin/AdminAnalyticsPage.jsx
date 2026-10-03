import React from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { BarChart3, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminAnalyticsPage = () => {
  const { analytics } = useData();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Smart Campus Analytics & AI Insights"
        subtitle="Predictive anomaly detection, recurring grievance identification, and resolution velocity metrics."
        badge="AI Intelligence Engine"
      />

      {/* Smart AI Recurring Issue Detection Banner Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" /> AI Anomaly & Recurring Issue Detections
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.smartInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-5 rounded-3xl border shadow-xs flex flex-col justify-between ${
                insight.type === 'Warning'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                  : insight.type === 'Success'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-teal-50/70 border-teal-200 text-teal-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80">
                    {insight.type} Alert
                  </span>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{insight.title}</h4>
                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{insight.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-bold text-slate-800">
                <span className="text-purple-700 font-extrabold">AI Action Recommendation:</span>
                <p className="text-slate-600 font-medium mt-0.5">{insight.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complaint Category Breakdown Chart Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Complaint Category Breakdown</h3>
          <div className="space-y-3">
            {analytics.complaintCategoriesCount.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.category}</span>
                  <span>{item.count} Tickets</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / 30) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requests per Week Bar Chart Simulation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Requests Processed per Week</h3>
          <div className="flex items-end justify-between gap-3 h-48 pt-6 pb-2 border-b border-slate-200 px-2">
            {[
              { week: 'W1 Aug', count: 45 },
              { week: 'W2 Aug', count: 62 },
              { week: 'W3 Aug', count: 78 },
              { week: 'W4 Aug', count: 52 },
              { week: 'W1 Sep', count: 94 },
              { week: 'W2 Sep', count: 110 },
            ].map((bar) => (
              <div key={bar.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-700">{bar.count}</span>
                <div
                  className="w-full bg-teal-600 rounded-t-xl transition-all hover:bg-teal-700"
                  style={{ height: `${(bar.count / 120) * 100}%` }}
                />
                <span className="text-[10px] text-slate-500 font-semibold">{bar.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
