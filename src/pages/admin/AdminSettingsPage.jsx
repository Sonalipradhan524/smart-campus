import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { authAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Settings, ShieldCheck, Sparkles, Check, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage = () => {
  const { showToast } = useData();

  const [aiRoutingEnabled, setAiRoutingEnabled] = useState(true);
  const [autoApprovalGatePass, setAutoApprovalGatePass] = useState(true);
  const [academicYear, setAcademicYear] = useState('2026 - 2027 (Even Semester)');

  // Admin creation state
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminDept, setAdminDept] = useState('Campus Administration');
  const [adminMsg, setAdminMsg] = useState('');
  const [adminErr, setAdminErr] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('CampusOS system settings updated successfully!', 'success');
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminMsg('');
    setAdminErr('');

    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      return setAdminErr('Please fill out all administrator required fields.');
    }

    setAdminLoading(true);
    try {
      const res = await authAPI.createAdmin({
        name: adminName.trim(),
        email: adminEmail.trim(),
        password: adminPassword.trim(),
        department: adminDept,
      });
      setAdminMsg(res.message || 'Administrator account created successfully.');
      showToast(`Administrator account created for ${adminEmail}!`, 'success');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
    } catch (err) {
      setAdminErr(err.message || 'Error creating administrator account.');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <PageHeader
        title="CampusOS System Settings & Administration"
        subtitle="Global platform feature toggles, administrator account management, and security controls."
        badge="System Config"
      />

      {/* Settings Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <Settings className="w-4 h-4 text-teal-600" /> Platform Configuration
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Active Academic Session
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> AI & Automation Engine Flags
            </h4>

            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <div>
                <p className="font-bold text-slate-800">Automated AI Grievance Categorization</p>
                <p className="text-[11px] text-slate-500">Auto-detect electrical, plumbing & IT tickets from text.</p>
              </div>
              <input
                type="checkbox"
                checked={aiRoutingEnabled}
                onChange={(e) => setAiRoutingEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-bold text-slate-800">Auto-Approve Day Gate Outing Permits</p>
                <p className="text-[11px] text-slate-500">Auto-verify gate passes with return time before 08:30 PM.</p>
              </div>
              <input
                type="checkbox"
                checked={autoApprovalGatePass}
                onChange={(e) => setAutoApprovalGatePass(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save System Settings
            </button>
          </div>
        </form>
      </div>

      {/* Administrator Management (Authorized Only) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> Administrator Account Management
          </h3>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
            Authenticated Admin Only
          </span>
        </div>

        {adminErr && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{adminErr}</span>
          </div>
        )}

        {adminMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{adminMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
          <p className="text-slate-500 text-xs leading-relaxed">
            Public internet administrator registration is disabled for safety compliance. Create additional administrative credentials for verified campus personnel below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Dr. S. K. Mohapatra"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Admin Email Address *</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin2@bput.ac.in"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Password *</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Department</label>
              <input
                type="text"
                value={adminDept}
                onChange={(e) => setAdminDept(e.target.value)}
                placeholder="Campus Affairs & Security"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={adminLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{adminLoading ? 'Creating Admin...' : 'Create Administrator Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
