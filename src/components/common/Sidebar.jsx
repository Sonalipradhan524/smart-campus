import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Grid,
  FileText,
  DoorOpen,
  Award,
  Home,
  Utensils,
  AlertTriangle,
  Clock,
  Calendar,
  BellRing,
  CreditCard,
  Sparkles,
  User,
  Users,
  BarChart3,
  Settings,
  X,
  ShieldCheck,
  GraduationCap,
  Megaphone,
  UserCheck,
  BookOpen,
  ClipboardList
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { role } = useAuth();

  const studentLinks = [
    { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { label: 'Service Hub', path: '/student/services', icon: Grid },
    { label: 'My Requests', path: '/student/requests', icon: FileText },
    { label: 'Leave Apply', path: '/student/leave', icon: Calendar },
    { label: 'Gate Pass', path: '/student/gate-pass', icon: DoorOpen },
    { label: 'Certificates', path: '/student/certificates', icon: Award },
    { label: 'Hostel Hub', path: '/student/hostel', icon: Home },
    { label: 'Mess Services', path: '/student/mess', icon: Utensils },
    { label: 'Complaints', path: '/student/complaints', icon: AlertTriangle },
    { label: 'Attendance', path: '/student/attendance', icon: Clock },
    { label: 'Timetable', path: '/student/timetable', icon: Calendar },
    { label: 'Notice Center', path: '/student/notices', icon: Megaphone },
    { label: 'Notifications', path: '/student/notifications', icon: BellRing },
    { label: 'Fees & Payments', path: '/student/fees', icon: CreditCard },
    { label: 'CampusAI', path: '/student/assistant', icon: Sparkles, badge: 'AI' },
    { label: 'My Profile', path: '/student/profile', icon: User },
  ];

  const teacherLinks = [
    { label: 'Faculty Dashboard', path: '/teacher', icon: LayoutDashboard },
    { label: 'My Classes', path: '/teacher/classes', icon: BookOpen },
    { label: 'Mark Attendance', path: '/teacher/attendance', icon: UserCheck, badge: 'Daily' },
    { label: 'My Students', path: '/teacher/students', icon: Users },
    { label: 'Class Schedules', path: '/teacher/timetable', icon: Calendar },
    { label: 'Assignments', path: '/teacher/assignments', icon: ClipboardList },
    { label: 'Student Requests', path: '/teacher/requests', icon: FileText },
    { label: 'Class Notices', path: '/teacher/notices', icon: Megaphone },
    { label: 'Notifications', path: '/teacher/notifications', icon: BellRing },
    { label: 'My Profile', path: '/teacher/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Requests', path: '/admin/requests', icon: FileText },
    { label: 'Grievance Desk', path: '/admin/complaints', icon: AlertTriangle },
    { label: 'Student Directory', path: '/admin/students', icon: Users },
    { label: 'Faculty Directory', path: '/admin/teachers', icon: UserCheck, badge: 'Faculty' },
    { label: 'Attendance Audit', path: '/admin/attendance', icon: Clock },
    { label: 'Class Schedules', path: '/admin/timetable', icon: Calendar },
    { label: 'Publish Notices', path: '/admin/notices', icon: Megaphone },
    { label: 'Hostel & Mess', path: '/admin/hostel', icon: Home },
    { label: 'Fee Governance', path: '/admin/fees', icon: CreditCard },
    { label: 'Smart Analytics', path: '/admin/analytics', icon: BarChart3, badge: 'Insights' },
    { label: 'Broadcast Alert', path: '/admin/notifications', icon: BellRing },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-50 lg:z-30 w-64 h-screen lg:h-[calc(100vh-61px)] bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="font-bold text-slate-900 text-base">CampusOS</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Banner inside Sidebar */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 hidden lg:block">
          <div className="flex items-center gap-2">
            {role === 'admin' ? (
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
            ) : role === 'teacher' ? (
              <UserCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            ) : (
              <GraduationCap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            )}
            <div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {role === 'admin' ? 'ADMINISTRATOR PORTAL' : role === 'teacher' ? 'TEACHER PORTAL' : 'STUDENT PORTAL'}
              </p>
              <p className="text-[10px] text-slate-500">BPUT Autonomous Campus</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/student' || link.path === '/teacher' || link.path === '/admin'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? role === 'admin' ? 'bg-slate-900 text-white shadow-md' : role === 'teacher' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-purple-100 text-purple-700 uppercase">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / System Status */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Campus Network
            </span>
            <span className="font-mono text-[10px] text-slate-400">v2.5.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
