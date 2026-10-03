import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, GraduationCap, ShieldCheck, UserCheck } from 'lucide-react';

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, role, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Check if current user role matches allowed roles for this route
  if (allowedRoles && !allowedRoles.includes(role)) {
    const getTargetRoute = (userRole) => {
      if (userRole === 'admin') return '/admin';
      if (userRole === 'teacher') return '/teacher';
      return '/student';
    };

    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full filter blur-3xl pointer-events-none" />

        <div className="z-10 max-w-md bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">Access Restricted</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your account role (<strong className="text-rose-400 uppercase">{role}</strong>) does not have authorization to view this section.
          </p>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-center gap-2">
            {role === 'admin' ? <ShieldCheck className="w-4 h-4 text-teal-400" /> : role === 'teacher' ? <UserCheck className="w-4 h-4 text-indigo-400" /> : <GraduationCap className="w-4 h-4 text-emerald-400" />}
            <span>Authenticated as: <strong className="text-white">{user.name}</strong></span>
          </div>

          <div className="pt-2">
            <Link
              to={getTargetRoute(role)}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 hover:opacity-95 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to {role.toUpperCase()} Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
