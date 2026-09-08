import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Bell,
  Search,
  Menu,
  ShieldCheck,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  Check,
  GraduationCap,
  UserCheck
} from 'lucide-react';

export const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, markAllNotificationsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (role === 'admin') {
      navigate('/admin/requests');
    } else if (role === 'teacher') {
      navigate('/teacher/attendance');
    } else {
      navigate('/student/services');
    }
  };

  const getRoleBadge = (r) => {
    if (r === 'admin') return { label: 'ADMIN', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (r === 'teacher') return { label: 'TEACHER', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    return { label: 'STUDENT', color: 'bg-blue-50 text-blue-700 border-blue-200' };
  };

  const badge = getRoleBadge(role);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Section: Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to={role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/student'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">CampusOS</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">One Campus. One Platform.</p>
            </div>
          </Link>
        </div>

        {/* Center: Global Search (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={role === 'admin' ? "Search student/teacher ID, requests..." : role === 'teacher' ? "Search classes, attendance, students..." : "Search services, requests, notices..."}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl outline-none transition"
          />
        </form>

        {/* Right Section: 3-Way Role Switcher, AI Link, Notifications, Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo 3-Way Persona Switch Button */}
          <div className="hidden md:flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs font-medium">
            <button
              onClick={() => { switchRole('student'); navigate('/student'); }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition ${
                role === 'student' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student
            </button>
            <button
              onClick={() => { switchRole('teacher'); navigate('/teacher'); }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition ${
                role === 'teacher' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-300" />
              Teacher
            </button>
            <button
              onClick={() => { switchRole('admin'); navigate('/admin'); }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition ${
                role === 'admin' ? 'bg-slate-900 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Admin
            </button>
          </div>

          {/* AI Assistant Quick Button for Student */}
          {role === 'student' && (
            <Link
              to="/student/assistant"
              className="p-2 sm:px-3 sm:py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 hover:opacity-95 transition"
              title="CampusAI Assistant"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span className="hidden md:inline">CampusAI</span>
            </Link>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[11px] bg-rose-50 text-rose-600 rounded-full font-semibold">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
                  {safeNotifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No notifications.</p>
                  ) : (
                    safeNotifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id || notif._id}
                        className={`p-3 rounded-xl text-xs transition ${
                          notif.read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50/60 text-slate-900 font-medium border border-blue-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-blue-700 uppercase text-[10px] tracking-wider">{notif.type || 'Notice'}</span>
                          <span className="text-[10px] text-slate-400">{notif.time || notif.date || 'Today'}</span>
                        </div>
                        <p className="font-bold text-slate-800">{notif.title}</p>
                        <p className="text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                  <Link
                    to={role === 'admin' ? '/admin/notifications' : role === 'teacher' ? '/teacher/notifications' : '/student/notifications'}
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View All Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/20"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-bold text-slate-900 text-sm leading-tight">{user?.name || 'Rahul Sharma'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'student@bput.ac.in'}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    {user?.rollNo || user?.employeeId || user?._id || 'ID-001'}
                  </span>
                </div>

                <Link
                  to={role === 'admin' ? '/admin/settings' : role === 'teacher' ? '/teacher/profile' : '/student/profile'}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  My {role.toUpperCase()} Profile
                </Link>

                <div className="md:hidden py-1 border-t border-b border-slate-100 my-1">
                  <p className="px-3 text-[10px] text-slate-400 font-bold uppercase mb-1">Switch Persona</p>
                  <button
                    onClick={() => { switchRole('student'); navigate('/student'); setShowProfileMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg ${role === 'student' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'}`}
                  >
                    Student Persona
                  </button>
                  <button
                    onClick={() => { switchRole('teacher'); navigate('/teacher'); setShowProfileMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg ${role === 'teacher' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'}`}
                  >
                    Teacher Persona
                  </button>
                  <button
                    onClick={() => { switchRole('admin'); navigate('/admin'); setShowProfileMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg ${role === 'admin' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700'}`}
                  >
                    Admin Persona
                  </button>
                </div>

                <button
                  onClick={() => { logout(); navigate('/login'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
