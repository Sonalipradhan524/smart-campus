import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Loader2,
  AlertCircle,
  Sparkles,
  Calendar as CalendarIcon,
  Download,
  Check,
  X,
  FileText
} from 'lucide-react';

export const AttendancePage = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' | 'calendar' | 'history'
  const [subjectFilter, setSubjectFilter] = useState('All');

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await attendanceAPI.get();
      setAttendance(data || null);
    } catch (err) {
      setError(err.message || 'Unable to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleExportCSV = () => {
    if (!attendance || !attendance.subjects) return;
    const headers = ['Subject Code', 'Subject Name', 'Faculty', 'Classes Attended', 'Total Classes', 'Attendance Percentage', 'Status'];
    const rows = attendance.subjects.map(s => [
      `"${s.code}"`,
      `"${s.name}"`,
      `"${s.teacher || 'Faculty'}"`,
      s.attended,
      s.total,
      `"${s.percentage}%"`,
      s.percentage < 75 ? '"Low Attendance Warning"' : '"Normal Range"'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200/80 my-8">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-xs text-slate-500 mt-2 font-semibold">Loading real-time attendance database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center my-8">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-rose-800">{error}</p>
        <button
          onClick={fetchAttendance}
          className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const subjects = attendance?.subjects || [];
  const calendarRecords = attendance?.calendarRecords || {};
  const historyLog = attendance?.detailedHistory || [];
  const overallPct = attendance?.overallPercentage || 0;
  const isLowAttendance = overallPct < 75;
  const consecutiveNeeded = attendance?.consecutiveNeeded || 0;

  const filteredSubjects = subjects.filter(s => {
    if (subjectFilter === 'All') return true;
    return s.code === subjectFilter || s.name === subjectFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Smart Attendance & Audit Portal"
        subtitle="Real-time attendance calculations, subject analytics, 75% threshold tracking, and calendar log."
        badge={`${overallPct}% Overall`}
      >
        <button
          onClick={handleExportCSV}
          disabled={subjects.length === 0}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
        >
          <Download className="w-4 h-4 text-teal-400" /> Export CSV Report
        </button>
      </PageHeader>

      {/* Threshold Status Banner */}
      {isLowAttendance ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-400/30 text-rose-900 flex items-start gap-3 text-xs shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-rose-900 text-sm flex items-center gap-2">
              ⚠ Low Attendance Warning (Below 75% Requirement)
            </h4>
            <p className="mt-1 leading-relaxed text-rose-800">
              Your current overall attendance is <strong className="text-rose-900 underline">{overallPct}%</strong>, which is below the university requirement of <strong>75.0%</strong>.
              {consecutiveNeeded > 0 && (
                <span> You need to attend the next <strong className="bg-rose-200/80 px-1.5 py-0.5 rounded text-rose-950">{consecutiveNeeded} consecutive classes</strong> without absence to reach 75%.</span>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-900 flex items-start gap-3 text-xs shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-emerald-900 text-sm">✓ Attendance Within Required Range</h4>
            <p className="mt-0.5 leading-relaxed text-emerald-800">
              Your overall attendance is <strong className="text-emerald-950">{overallPct}%</strong>. You are fully eligible for university semester examinations.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${overallPct}%`}
          subtitle="Minimum Threshold: 75.0%"
          icon={Clock}
          color={isLowAttendance ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Classes Attended"
          value={`${attendance?.attendedClasses || 0} / ${attendance?.totalClasses || 0}`}
          subtitle="Lectures & Labs Verified"
          icon={CheckCircle2}
          color="teal"
        />
        <StatCard
          title="Absences Recorded"
          value={attendance?.absentClasses || 0}
          subtitle={isLowAttendance ? `${consecutiveNeeded} classes needed to recover` : 'All mandatory sessions covered'}
          icon={XCircle}
          color={isLowAttendance ? 'rose' : 'purple'}
        />
      </div>

      {/* Data-Driven Smart Insights Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Smart Attendance Insight Engine</span>
          </div>
          <p className="text-sm font-bold text-slate-100 leading-relaxed">
            {attendance?.smartInsight || `You have attended ${attendance?.attendedClasses || 0} out of ${attendance?.totalClasses || 0} classes.`}
          </p>
        </div>
        {consecutiveNeeded > 0 && (
          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-center flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">Required Attendance</span>
            <p className="text-lg font-black text-white">+{consecutiveNeeded} Classes</p>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'subjects'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Subject Breakdown ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'calendar'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarIcon className="w-4 h-4" /> Attendance Calendar
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Detailed History ({historyLog.length})
        </button>
      </div>

      {/* Tab Content: Subject Breakdown */}
      {activeTab === 'subjects' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" /> Subject-wise Performance
            </h3>

            {subjects.length > 0 && (
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="All">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                ))}
              </select>
            )}
          </div>

          {subjects.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800">No attendance recorded yet.</h4>
              <p className="text-xs text-slate-500 mt-1">No class sessions have been marked for your enrolled courses yet in the database.</p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              No subject matching the selected filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubjects.map((sub) => {
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
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Faculty: {sub.teacher || 'Assigned Faculty'}</p>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Attended: {sub.attended} / {sub.total} classes</span>
                        <span>{sub.percentage}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLow ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, sub.percentage))}%` }}
                        />
                      </div>
                    </div>

                    {isLow && sub.neededFor75 > 0 && (
                      <p className="text-[11px] text-rose-700 font-bold mt-2 pt-2 border-t border-rose-100 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Attend next <strong>{sub.neededFor75} consecutive classes</strong> to reach 75%</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Attendance Calendar */}
      {activeTab === 'calendar' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-teal-600" /> Recorded Sessions Calendar
            </h3>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Present
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> Absent
              </span>
            </div>
          </div>

          {Object.keys(calendarRecords).length === 0 ? (
            <div className="p-12 text-center">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800">No attendance dates recorded.</h4>
              <p className="text-xs text-slate-500 mt-1">Calendar dates populate as teachers log real class sessions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(calendarRecords).map(([dateStr, record]) => (
                <div
                  key={dateStr}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                    record.status === 'present'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/60 border-rose-200 text-rose-900'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{record.date}</span>
                    <span className="text-[11px] font-medium text-slate-600 block mt-0.5">{record.subject}</span>
                    <span className="text-[10px] text-slate-400 block">{record.teacher}</span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 ${
                      record.status === 'present' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {record.status === 'present' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Detailed History Log */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-teal-600" /> Class Session Audit Log
          </h3>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Subject Code</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Faculty</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {historyLog.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No attendance history records yet.</td>
                  </tr>
                ) : (
                  historyLog.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{log.date}</td>
                      <td className="p-3 font-mono text-teal-700 font-bold">{log.subjectCode}</td>
                      <td className="p-3 text-slate-800 font-bold">{log.subject}</td>
                      <td className="p-3 text-slate-600">{log.section || 'Sec A'}</td>
                      <td className="p-3 text-slate-600">{log.teacherName || 'Faculty'}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                            log.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
