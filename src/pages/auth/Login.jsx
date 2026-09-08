import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, School, ShieldCheck, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export const Login = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full space-y-8 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5" /> BPUT Autonomous CampusOS Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Access Portals
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Select your assigned university role to enter your dedicated portal or create a real authenticated account.
          </p>
        </div>

        {/* 3 Role Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 hover:border-blue-500/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition duration-200 shadow-inner">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Portal 01</span>
                <h3 className="text-xl font-bold text-white">Student Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Access course enrollment, gate passes, hostel permits, timetable, mess menus, and AI assistant.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>Digital QR Gate Passes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>Leave & Certificate Requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>24/7 CampusAI Support</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-700/60">
              <Link
                to="/student/login"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition"
              >
                <span>Login as Student</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/student/register"
                className="w-full py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                Create Student Account
              </Link>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 hover:border-purple-500/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition duration-200 shadow-inner">
                <School className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Portal 02</span>
                <h3 className="text-xl font-bold text-white">Faculty Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage section rosters, mark class attendance, review student permits, and post notices.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>Class Attendance Marking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>Student Permit Approvals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>Publish Academic Notices</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-700/60">
              <Link
                to="/teacher/login"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition"
              >
                <span>Login as Faculty</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/teacher/register"
                className="w-full py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                Create Faculty Account
              </Link>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 hover:border-amber-500/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition duration-200 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Portal 03</span>
                <h3 className="text-xl font-bold text-white">Admin Console</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Institutional oversight, faculty registration, campus analytics, and security controls.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Faculty & Student Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>System Audit & Security Logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Protected Admin Accounts</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-700/60">
              <Link
                to="/admin/login"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition"
              >
                <span>Login as Administrator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="py-2.5 text-center text-[11px] text-slate-400 font-medium bg-slate-900/40 rounded-xl border border-slate-800">
                Public Register Restricted
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-4 text-xs text-slate-500">
          CampusOS Platform Version 2.4 (Real Database Authentication Engine Connected)
        </div>
      </div>
    </div>
  );
};
