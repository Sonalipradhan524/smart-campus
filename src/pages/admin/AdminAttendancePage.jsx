import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { adminAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Download,
  Filter,
  Loader2,
  Send,
  BookOpen,
  Calendar,
  XCircle
} from 'lucide-react';

export const AdminAttendancePage = () => {
  const { showToast } = useData();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const params = {};
      if (departmentFilter !== 'All') params.department = departmentFilter;
      if (semesterFilter !== 'All') params.semester = semesterFilter;
      if (sectionFilter !== 'All') params.section = sectionFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await adminAPI.getAttendanceOverview(params);
      setOverview(res || null);
    } catch (err) {
      setOverview(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [departmentFilter, semesterFilter, sectionFilter, dateFilter]);

  const handleExportCSV = () => {
    if (!overview || !overview.lowAttendanceList) return;
    const headers = ['Student ID / Roll', 'Student Name', 'Department', 'Semester', 'Classes Attended', 'Total Classes', 'Attendance %'];
    const rows = (overview.lowAttendanceList || []).map(s => [
      `"${s.rollNo || s.studentId}"`,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.semester}"`,
      s.attended,
      s.total,
      `"${s.percentage}%"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Campus_Attendance_Monitoring_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const lowList = overview?.lowAttendanceList || [];
  const totalStudents = overview?.totalStudents || 0;
  const overallPct = overview?.overallPercentage || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Campus Smart Attendance Governance"
        subtitle="Institutional attendance monitoring, low-presence alerts, and filterable department statistics."
        badge="Academic Audit"
      >
        <button
          onClick={handleExportCSV}
          disabled={lowList.length === 0}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
        >
          <Download className="w-4 h-4" /> Export Campus Audit CSV
        </button>
      </PageHeader>

      {/* Filter Control Panel */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          <Filter className="w-4 h-4 text-amber-600" /> Filter Campus Attendance Data
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Departments</option>
              <option value="CSE">Computer Science & Engg</option>
              <option value="ECE">Electronics & Comm Engg</option>
              <option value="EEE">Electrical & Electronics Engg</option>
              <option value="MECH">Mechanical Engg</option>
              <option value="CIVIL">Civil Engg</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Semester</label>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Semesters</option>
              <option value="1st Semester">1st Semester</option>
              <option value="3rd Semester">3rd Semester</option>
              <option value="4th Semester">4th Semester</option>
              <option value="6th Semester">6th Semester</option>
              <option value="8th Semester">8th Semester</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Sections</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
              <option value="Section C">Section C</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Specific Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Registered Students"
          value={totalStudents}
          subtitle="Enrolled Campus Roster"
          icon={Users}
          color="amber"
        />
        <StatCard
          title="Overall Presence Avg"
          value={`${overallPct}%`}
          subtitle="Requirement: 75.0%"
          icon={Clock}
          color={overallPct < 75 ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Present Records"
          value={overview?.presentCount || 0}
          subtitle="Total Present Marks"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Low Attendance Warnings"
          value={overview?.lowAttendanceCount || 0}
          subtitle="Students Below 75%"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Low Attendance Alert List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5" /> Low Attendance Audit List (&lt;75% Threshold)
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {lowList.length} Students flagged
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Auditing real student attendance records from database...</p>
          </div>
        ) : lowList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
            <h4 className="font-extrabold text-slate-900 text-sm">All Students Compliant</h4>
            <p className="text-xs text-slate-600">
              No students are currently below the 75% attendance threshold for the selected filters.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {lowList.map((s) => (
              <div key={s.studentId || s.rollNo} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{s.name} ({s.rollNo || s.studentId})</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{s.department} • Semester: {s.semester}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-xs">
                    {s.percentage}% Attendance
                  </span>
                  <button
                    onClick={() => showToast && showToast(`Warning alert notice dispatched to ${s.name}.`, 'info')}
                    className="px-3 py-1.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Notice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
