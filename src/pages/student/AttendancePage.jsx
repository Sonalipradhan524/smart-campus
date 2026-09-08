import React from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Clock, AlertTriangle, CheckCircle2, XCircle, BookOpen, AlertCircle } from 'lucide-react';

export const AttendancePage = () => {
  const { attendance } = useData();

  const isLowAttendance = attendance.overallPercentage < 75;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Attendance & Presence Monitoring"
        subtitle="Real-time academic attendance audit, subject breakdown, and eligibility threshold tracking."
        badge={`${attendance.overallPercentage}% Overall`}
      />

      {/* Threshold Warning Banner if needed */}
      {attendance.subjects.some((s) => s.lowWarning) && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-rose-900 text-sm">Attendance Warning Threshold Alert</h4>
            <p className="mt-0.5 leading-snug">
              Your attendance in <strong>Computer Networks & Security (CS-604)</strong> is currently <strong>73.8%</strong>, which is below the mandatory 75% university examination eligibility threshold. Please attend upcoming lectures to avoid hall ticket restriction.
            </p>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${attendance.overallPercentage}%`}
          subtitle="Requirement: Minimum 75.0%"
          icon={Clock}
          color={isLowAttendance ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Total Classes Attended"
          value={`${attendance.attendedClasses} / ${attendance.totalClasses}`}
          subtitle="Lectures & Lab sessions"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Absences Recorded"
          value={attendance.absentClasses}
          subtitle="Medical leave claims pending"
          icon={XCircle}
          color="amber"
        />
      </div>

      {/* Subject-wise Attendance Cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" /> Subject-wise Attendance Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attendance.subjects.map((sub) => {
            const isLow = sub.percentage < 75;
            return (
              <div
                key={sub.code}
                className={`p-5 rounded-2xl border transition ${
                  isLow ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-500">{sub.code}</span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-black rounded-full ${
                      isLow ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{sub.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Faculty: {sub.teacher}</p>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Presence: {sub.attended} / {sub.total} classes</span>
                    <span>{sub.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                </div>

                {isLow && (
                  <p className="mt-2 text-[11px] font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Requires 2 more classes for 75%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
