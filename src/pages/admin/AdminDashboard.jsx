import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Megaphone
} from 'lucide-react';

export const AdminDashboard = () => {
  const { analytics, requests, complaints, updateRequestStatus, updateComplaintStatus } = useData();

  const pendingRequests = requests.filter((r) => r.status === 'Pending' || r.status === 'In Progress');
  const openComplaints = complaints.filter((c) => c.status !== 'Resolved');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> Executive Control Tower
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            BPUT Autonomous Campus • Real-time governance for 3,420 students across 5 departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/analytics"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
          >
            <BarChart3 className="w-4 h-4" /> AI Insights & Analytics
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Students"
          value={analytics.totalStudents.toLocaleString()}
          subtitle="3,420 enrolled • 2,180 hostellers"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          subtitle="Outing & Certificate queue"
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Open Grievances"
          value={openComplaints.length}
          subtitle="Maintenance & IT tickets"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Avg Resolution Time"
          value={analytics.avgResolutionHours}
          subtitle="Reduced by 60% with AI routing"
          icon={Clock}
          color="emerald"
          trend={{ isUp: true, value: '60%', label: 'faster turnaround' }}
        />
      </div>

      {/* Grid: Pending Request Approvals & Open Grievances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Request Approval Queue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" /> Pending Approval Queue
            </h3>
            <Link to="/admin/requests" className="text-xs font-bold text-teal-600 hover:text-teal-800">
              Manage All ({requests.length})
            </Link>
          </div>

          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No pending request applications!</p>
            ) : (
              pendingRequests.slice(0, 3).map((req) => (
                <div key={req.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400">{req.id}</span>
                      <StatusBadge status={req.status} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{req.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{req.type} • {req.submittedDate}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <button
                      onClick={() => updateRequestStatus(req.id, 'Approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req.id, 'Rejected')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Grievances Action Queue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Grievance Desk Action Queue
            </h3>
            <Link to="/admin/complaints" className="text-xs font-bold text-teal-600 hover:text-teal-800">
              View All ({complaints.length})
            </Link>
          </div>

          <div className="space-y-3">
            {openComplaints.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Zero unresolved grievances!</p>
            ) : (
              openComplaints.slice(0, 3).map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400">{c.id}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">
                        {c.category}
                      </span>
                      <StatusBadge status={c.status} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{c.location} • Staff: {c.assignedTo}</p>
                  </div>

                  <div className="flex items-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <button
                      onClick={() => updateComplaintStatus(c.id, 'Resolved')}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Department Performance Summary */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">Department Performance & Attendance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {analytics.departmentWise.map((dept) => (
            <div key={dept.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-800 block truncate">{dept.name}</span>
              <p className="text-xs text-slate-500">{dept.total} Students</p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Presence:</span>
                <span>{dept.attendance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
