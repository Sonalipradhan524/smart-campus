import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getGreeting } from '../../utils/greeting';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  UserCheck,
  BookOpen,
  Users,
  Calendar,
  Sparkles,
  FileText,
  Megaphone,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus
} from 'lucide-react';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const { requests = [], notices = [] } = useData();

  const assignedClasses = user.assignedClasses || [
    { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '6th Semester', section: 'Section A', enrolledCount: 45 },
    { subject: 'Database Management Systems', code: 'CSE-304', semester: '4th Semester', section: 'Section B', enrolledCount: 42 },
    { subject: 'Artificial Intelligence & ML', code: 'CSE-402', semester: '8th Semester', section: 'Section A', enrolledCount: 38 }
  ];

  const pendingRequests = (Array.isArray(requests) ? requests : []).filter(r => r.status === 'Pending' || r.status === 'pending');
  const greeting = getGreeting();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-800 text-white shadow-xl shadow-indigo-600/20">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/20">
            <UserCheck className="w-3.5 h-3.5 text-indigo-200" /> Faculty Portal Connected
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {greeting}, {user?.name || 'Prof. Ananya Roy'} 👨‍🏫
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-2 leading-relaxed">
            You have <strong className="text-white underline">{assignedClasses.length} active classes</strong> assigned today. <strong className="text-white underline">{pendingRequests.length} student requests</strong> require your authorization.
          </p>
        </div>

        <div className="absolute -right-8 -bottom-12 w-64 h-64 bg-white/10 rounded-full filter blur-2xl pointer-events-none" />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Classes"
          value={assignedClasses.length}
          subtitle="Active Courses this term"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Total Students"
          value="125"
          subtitle="Enrolled across sections"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Attendance Status"
          value="Pending"
          subtitle="Today's CSE-301 Lecture"
          icon={UserCheck}
          color="amber"
        />
        <StatCard
          title="Student Permits"
          value={pendingRequests.length}
          subtitle="Leave & Academic reviews"
          icon={FileText}
          color="purple"
        />
      </div>

      {/* Quick Action Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" /> Faculty Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/teacher/attendance"
            className="p-4 rounded-2xl bg-indigo-50/80 hover:bg-indigo-600 hover:text-white border border-indigo-100 text-indigo-900 group transition duration-200"
          >
            <UserCheck className="w-6 h-6 text-indigo-600 group-hover:text-white mb-2" />
            <p className="font-bold text-xs">Mark Class Attendance</p>
            <p className="text-[10px] text-indigo-600 group-hover:text-indigo-100 mt-0.5">Persists directly to DB</p>
          </Link>

          <Link
            to="/teacher/classes"
            className="p-4 rounded-2xl bg-teal-50/80 hover:bg-teal-600 hover:text-white border border-teal-100 text-teal-900 group transition duration-200"
          >
            <BookOpen className="w-6 h-6 text-teal-600 group-hover:text-white mb-2" />
            <p className="font-bold text-xs">My Classes & Roster</p>
            <p className="text-[10px] text-teal-600 group-hover:text-teal-100 mt-0.5">View Enrolled Students</p>
          </Link>

          <Link
            to="/teacher/notices"
            className="p-4 rounded-2xl bg-purple-50/80 hover:bg-purple-600 hover:text-white border border-purple-100 text-purple-900 group transition duration-200"
          >
            <Megaphone className="w-6 h-6 text-purple-600 group-hover:text-white mb-2" />
            <p className="font-bold text-xs">Post Class Bulletin</p>
            <p className="text-[10px] text-purple-600 group-hover:text-purple-100 mt-0.5">Academic Broadcasts</p>
          </Link>

          <Link
            to="/teacher/requests"
            className="p-4 rounded-2xl bg-emerald-50/80 hover:bg-emerald-600 hover:text-white border border-emerald-100 text-emerald-900 group transition duration-200"
          >
            <FileText className="w-6 h-6 text-emerald-600 group-hover:text-white mb-2" />
            <p className="font-bold text-xs">Authorize Requests</p>
            <p className="text-[10px] text-emerald-600 group-hover:text-emerald-100 mt-0.5">Approve/Reject Leave</p>
          </Link>
        </div>
      </div>

      {/* Main Grid: Today's Lectures & Pending Student Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Teaching Schedule (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Today's Teaching Schedule</h3>
                <p className="text-xs text-slate-500">Department of Computer Science & Engineering</p>
              </div>
              <Link to="/teacher/attendance" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                Mark Attendance <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {assignedClasses.map((cls, idx) => (
                <div
                  key={cls.code || idx}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-indigo-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-xs flex-shrink-0">
                      {cls.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cls.subject}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{cls.semester}</span> • <span>{cls.section}</span> • <span className="font-medium text-slate-700">{cls.enrolledCount} Students</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <Link
                      to={`/teacher/attendance?class=${cls.code}`}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Mark Present
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pending Student Permits */}
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Pending Student Permits</h3>
              <Link to="/teacher/requests" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  No pending student permits.
                </div>
              ) : (
                pendingRequests.slice(0, 4).map((req) => (
                  <div key={req.id || req._id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white transition space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{req.studentName || 'Student'}</span>
                      <StatusBadge status={req.status || 'Pending'} />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{req.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{req.type}</span>
                      <Link to="/teacher/requests" className="text-indigo-600 font-bold hover:underline">
                        Review →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
