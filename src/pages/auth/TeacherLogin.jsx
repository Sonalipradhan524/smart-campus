import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { School, Lock, User, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const TeacherLogin = () => {
  const navigate = useNavigate();
  const { loginTeacher, loading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter your Employee ID / Email and password.');
      return;
    }

    const res = await loginTeacher(identifier.trim(), password.trim());
    if (res.success) {
      navigate('/teacher/dashboard');
    } else {
      setErrorMessage(res.message || 'Invalid Employee ID or password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 mb-2 shadow-inner">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Faculty Portal Login</h1>
          <p className="text-xs text-slate-400">BPUT Teacher & Academic Staff Credentials</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2 animate-shake">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Employee ID or Email Address <span className="text-purple-400">*</span></label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. FAC-CSE-004 or teacher@bput.ac.in"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password <span className="text-purple-400">*</span></label>
              <Link to="/forgot-password" className="text-[11px] font-medium text-purple-400 hover:text-purple-300 transition flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-purple-500/25 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login as Faculty Member'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Links */}
        <div className="pt-4 border-t border-slate-700/60 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Need a faculty account?{' '}
            <Link to="/teacher/register" className="font-bold text-purple-400 hover:underline">
              Create Faculty Account
            </Link>
          </p>
          <div className="flex justify-center items-center gap-4 text-[11px] text-slate-500 font-medium">
            <Link to="/student/login" className="hover:text-slate-300 transition">Student Login</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-slate-300 transition">Admin Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
