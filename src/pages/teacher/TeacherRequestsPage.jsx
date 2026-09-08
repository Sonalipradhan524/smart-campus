import React from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FileText, Check, X, User } from 'lucide-react';

export const TeacherRequestsPage = () => {
  const { requests = [], updateRequestStatus, showToast } = useData();

  const handleAction = async (id, status) => {
    await updateRequestStatus(id, status);
    showToast(`Request ${status} by Faculty.`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Student Academic Permits & Requests"
        subtitle="Review and authorize student leave applications and academic permits"
        icon={FileText}
      />

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Student Request Queue</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {(requests || []).map((req) => (
            <div key={req.id || req._id} className="p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{req.studentName || 'Rahul Sharma'}</span>
                  <span className="text-xs font-mono text-slate-400">({req.rollNo || '2201105042'})</span>
                  <StatusBadge status={req.status || 'Pending'} />
                </div>
                <h4 className="font-bold text-slate-800 text-xs">{req.title}</h4>
                <p className="text-xs text-slate-500">{req.type} • Submitted: {req.submittedDate || 'Today'}</p>
              </div>

              {(req.status === 'Pending' || req.status === 'pending') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(req.id || req._id, 'Approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-xs"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id || req._id, 'Rejected')}
                    className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
