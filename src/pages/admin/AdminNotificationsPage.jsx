import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { BellRing, Send, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AdminNotificationsPage = () => {
  const { showToast } = useData();

  const [targetAudience, setTargetAudience] = useState('All Students');
  const [alertType, setAlertType] = useState('Emergency Alert');
  const [message, setMessage] = useState('');

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    showToast(`Broadcast notification dispatched to ${targetAudience}!`, 'success');
    setMessage('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <PageHeader
        title="Admin Notification Dispatcher"
        subtitle="Send high-priority broadcast push alerts or emergency announcements to campus groups."
        badge="Broadcast Cell"
      />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
            >
              <option value="All Students">All Enrolled Students (3,420)</option>
              <option value="Hostel Block B Residents">Hostel Block B Residents Only</option>
              <option value="Computer Science Dept">B.Tech Computer Science Students</option>
              <option value="Faculty & Staff">Faculty & Department Heads</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alert Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Emergency Alert', 'Academic Update', 'Hostel Announcement'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAlertType(t)}
                  className={`p-2.5 rounded-xl border font-bold transition text-center ${
                    alertType === t
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Broadcast Message Body
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter push notification message..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-rose-500/20 hover:bg-rose-700 flex items-center justify-center gap-2 text-xs"
          >
            <Send className="w-4 h-4" /> Dispatch Push Notification Now
          </button>
        </form>
      </div>
    </div>
  );
};
