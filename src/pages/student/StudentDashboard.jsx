import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getGreeting } from '../../utils/greeting';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Clock,
  FileText,
  Megaphone,
  AlertTriangle,
  DoorOpen,
  Calendar,
  Award,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  MapPin,
  UserCheck,
  Radio,
  PhoneCall
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { attendance, requests = [], notices = [], complaints = [], timetable = [] } = useData();

  const firstName = (user && user.name) ? user.name.split(' ')[0] : 'Student';
  const safeRequests = Array.isArray(requests) ? requests : [];
  const safeNotices = Array.isArray(notices) ? notices : [];
  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  const safeTimetable = Array.isArray(timetable) ? timetable : [];

  const pendingRequestsCount = safeRequests.filter((r) => r.status === 'Pending' || r.status === 'In Progress' || r.status === 'pending').length;
  const unreadNoticesCount = safeNotices.filter((n) => !n.readStatus).length;
  const activeComplaintsCount = safeComplaints.filter((c) => c.status !== 'Resolved' && c.status !== 'resolved').length;

  const studentBranch = (user?.branch || user?.department || 'CSE').toUpperCase();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];
  const activeDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(todayName) ? todayName : 'Monday';

  // Filter today's timetable for student's branch & day
  const todayClasses = safeTimetable.filter((t) => {
    const matchBranch = (t.branch || 'CSE').toUpperCase().includes(studentBranch.slice(0, 3));
    return matchBranch && t.day === activeDay;
  });

  const greeting = getGreeting();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-indigo-700 text-white shadow-xl shadow-teal-600/20">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-teal-200" /> Smart CampusOS Connected
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Here’s what’s happening on your campus today. You have <strong className="text-white underline">{pendingRequestsCount} active request</strong> and <strong className="text-white underline">{todayClasses.length} lectures scheduled</strong>.
          </p>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-12 w-64 h-64 bg-white/10 rounded-full filter blur-2xl pointer-events-none" />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${attendance?.overallPercentage || 88}%`}
          subtitle={`${attendance?.attendedClasses || 44} / ${attendance?.totalClasses || 50} classes attended`}
          icon={Clock}
          color="emerald"
          trend={{ isUp: true, value: '1.5%', label: 'this month' }}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequestsCount}
          subtitle="Outing & Certificate track"
          icon={FileText}
          color="teal"
        />
        <StatCard
          title="Unread Notices"
          value={unreadNoticesCount}
          subtitle="Exam & Hostel announcements"
          icon={Megaphone}
          color="amber"
        />
        <StatCard
          title="Active Grievances"
          value={activeComplaintsCount}
          subtitle="Maintenance & Electrical"
          icon={AlertTriangle}
          color="purple"
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600" /> Quick Campus Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/student/gate-pass"
            className="p-4 rounded-2xl bg-teal-50/70 hover:bg-teal-600 hover:text-white border border-teal-100 text-teal-900 group transition duration-200"
          >
            <DoorOpen className="w-6 h-6 text-teal-600 group-hover:text-white mb-2" />
            <p className="font-bold text-xs">Request Gate Pass</p>
            <p className="text-[10px] text-teal-600 group-hover:text-teal-100 mt-0.5">Digital Outing Permit</p>
          </Link>

          <Link
            to="/student/leave"
            className="p-4 rounded-2xl bg-indigo-50/70 hover:bg-indigo-600 hover:text-white border border-indigo-100 text-indigo-900 group transition duration-200"
          >
            <Calendar className="w-6 h-6 text-indigo-600 group-hover:text-white mb-2" />
            <p className="font-bold text-xs">Apply Leave</p>
            <p className="text-[10px] text-indigo-600 group-hover:text-indigo-100 mt-0.5">Medical & Academic</p>
          </Link>

          <Link
            to="/student/certificates"
            className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-600 hover:text-white border border-emerald-100 text-emerald-900 group transition duration-200"
          >
            <Award className="w-6 h-6 text-emerald-600 group-hover:text-white mb-2" />
            <p className="font-bold text-xs">Request Certificate</p>
            <p className="text-[10px] text-emerald-600 group-hover:text-emerald-100 mt-0.5">Bonafide & Conduct</p>
          </Link>

          <Link
            to="/student/complaints"
            className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-600 hover:text-white border border-amber-100 text-amber-900 group transition duration-200"
          >
            <AlertTriangle className="w-6 h-6 text-amber-600 group-hover:text-white mb-2" />
            <p className="font-bold text-xs">Report Grievance</p>
            <p className="text-[10px] text-amber-600 group-hover:text-amber-100 mt-0.5">AI Auto-Classified</p>
          </Link>
        </div>

        {/* Campus Beacon Emergency Call & SOS Quick Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-50/60 p-3.5 rounded-2xl border border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black flex-shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-rose-900">Campus Beacon (Emergency Call & SOS)</p>
              <p className="text-[10px] text-rose-700">4 Direct Emergency Dialers (7848988524, 9861014225, 9124028834, 8917309755) & 1-Tap SOS</p>
            </div>
          </div>
          <Link
            to="/student/beacon"
            className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/20 transition whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Open Emergency Beacon</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Request Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule Container */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Today's Class Schedule ({activeDay})</h3>
                <p className="text-xs text-slate-500">3rd Semester B.Tech • Branch: {studentBranch}</p>
              </div>
              <Link to="/student/timetable" className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1">
                Full Timetable <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {todayClasses.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  No classes scheduled for today ({activeDay}).
                </div>
              ) : (
                todayClasses.map((item) => (
                  <div
                    key={item.id || item._id || item.code}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-teal-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-extrabold text-xs flex-shrink-0">
                        {item.code || 'CSE'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.subject || 'Lecture'}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1"><UserCheck className="w-3 h-3 text-slate-400" /> Faculty: {item.teacher || item.faculty}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> Room {item.roomNo || item.room}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                        {item.time}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                        {item.classType || item.type || 'Lecture'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Important Notices */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Important Campus Notices</h3>
              <Link to="/student/notices" className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1">
                View All ({safeNotices.length}) <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {safeNotices.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  No published notices at this time.
                </div>
              ) : (
                safeNotices.slice(0, 3).map((notice) => (
                  <div key={notice.id || notice._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">{notice.department || 'General'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{notice.date || 'Today'}</span>
                        {notice.priority === 'High' || notice.priority === 'Emergency' || notice.priority === 'high' ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 rounded-full">
                            {notice.priority}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{notice.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{notice.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Request Tracker & CampusAI Shortcut */}
        <div className="space-y-6">
          {/* Recent Request Status */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Recent Request Status</h3>
              <Link to="/student/requests" className="text-xs font-bold text-teal-600 hover:text-teal-800">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {safeRequests.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                  No requests submitted yet.
                </div>
              ) : (
                safeRequests.slice(0, 4).map((req) => (
                  <div key={req.id || req._id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{req.id || req._id}</span>
                      <StatusBadge status={req.status || 'Pending'} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">{req.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                      <span>{req.type || 'Gate Pass'}</span>
                      <span>{req.submittedDate || req.startDate || 'Today'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Campus Assistant Widget */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">CampusAI Assistant</span>
            </div>
            <h4 className="font-bold text-base text-white">Need Quick Campus Help?</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Ask about Gate Passes, Leave policies, Mess menu, or instant Complaint filing.
            </p>
            <Link
              to="/student/assistant"
              className="mt-4 w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition text-white"
            >
              <span>Launch AI Conversation</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
