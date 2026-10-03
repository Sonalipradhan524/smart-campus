import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const { sendForgotPassword, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      return setErrorMessage('Please enter your registered email address.');
    }

    const res = await sendForgotPassword(email.trim());
    if (res.success) {
      setMessage(res.message);
    } else {
      setErrorMessage(res.message || 'Failed to send password reset request.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600/20 border border-teal-500/30 text-teal-400 mb-2 shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h1>
          <p className="text-xs text-slate-400">Enter your registered email to receive reset instructions</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {message && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-medium space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Reset Request Processed</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Registered Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@bput.ac.in"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-teal-500/25 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send Reset Instructions'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/60 text-center">
          <Link to="/student/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};
