import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, School, ShieldCheck, ArrowRight, CheckCircle, Sparkles, Building2 } from 'lucide-react';

export const Login = () => {
  const { user, isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to their assigned dashboard
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    }
    return <Navigate to="/student" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto w-full space-y-8 sm:space-y-10 relative z-10 animate-fade-in py-8">
        {/* Brand Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest shadow-inner">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Campus Connect Platform</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Campus Connect
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-300 font-medium">
            Welcome to Campus Connect
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Choose your institutional role below to access your secure portal or create an authenticated account.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* 1. Student Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-teal-500/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition duration-200 shadow-inner">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Option 01</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-teal-300 transition">Student</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Access live course timetable, digital QR gate passes, hostel permits, fees, and AI assistant.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Interactive Timetable & Attendance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Hostel, Mess & Gate Passes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>24/7 AI Campus Assistant</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-5 border-t border-slate-800">
              <Link
                to="/student/login"
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition duration-200"
              >
                <span>Student Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/student/register"
                className="w-full py-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition border border-slate-700/50"
              >
                Create Student Account
              </Link>
            </div>
          </div>

          {/* 2. Teacher Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-purple-500/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition duration-200 shadow-inner">
                <School className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Option 02</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition">Teacher</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage class section rosters, record live student attendance, review permits, and broadcast notices.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Class & Lab Attendance System</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Student Request & Leave Approvals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>Academic Notices & Assignments</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-5 border-t border-slate-800">
              <Link
                to="/teacher/login"
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition duration-200"
              >
                <span>Teacher Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/teacher/register"
                className="w-full py-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition border border-slate-700/50"
              >
                Create Teacher Account
              </Link>
            </div>
          </div>

          {/* 3. Administrator Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-amber-500/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition duration-200 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Option 03</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition">Administrator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Institutional governance, departments, courses, audit logs, fee tracking, and system security.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>University Departments & Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Security Logs & Auditing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Campus-wide Analytics</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-5 border-t border-slate-800">
              <Link
                to="/admin/login"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition duration-200"
              >
                <span>Administrator Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="py-2.5 text-center text-[11px] text-slate-400 font-medium bg-slate-950/60 rounded-xl border border-slate-800">
                Institutional Admin Access Only
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 text-xs text-slate-500">
          Campus Connect Secure Enterprise Authentication Engine
        </div>
      </div>
    </div>
  );
};

