import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { AlertTriangle, UserCheck, CheckCircle2, Clock, MapPin, Sparkles, Plus, Edit } from 'lucide-react';

export const AdminComplaintsPage = () => {
  const { complaints, updateComplaintStatus } = useData();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedCmp, setSelectedCmp] = useState(null);
  const [staffName, setStaffName] = useState('');
  const [internalNote, setInternalNote] = useState('');

  const tabs = ['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved'];

  const filtered = complaints.filter((c) => activeTab === 'All' || c.status === activeTab);

  const handleUpdateStatus = (newStatus) => {
    if (!selectedCmp) return;
    updateComplaintStatus(selectedCmp.id, newStatus, staffName);
    setSelectedCmp(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Administrative Grievance Desk"
        subtitle="Assign technicians, audit smart AI routing, and track resolution timelines."
        badge={`${complaints.length} Tickets Total`}
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 bg-white p-3 rounded-2xl border border-slate-200/90">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedCmp(c);
              setStaffName(c.assignedTo || '');
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-slate-400">{c.id}</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 rounded-md">
                    {c.category}
                  </span>
                  <StatusBadge status={c.status} />
                </div>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">{c.title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.location}
              </p>

              {/* AI Classification Info */}
              <div className="mt-3 p-3 rounded-2xl bg-purple-50/60 border border-purple-100 text-[11px] text-purple-900 space-y-0.5">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Target Dept: {c.aiMetadata?.targetDept}
                </p>
                <p className="text-slate-600">Assigned Staff: <strong>{c.assignedTo}</strong></p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Manage & Change Status</span>
              <span>Edit →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Complaint Action Drawer */}
      <Drawer
        isOpen={!!selectedCmp}
        onClose={() => setSelectedCmp(null)}
        title={`Grievance Control: ${selectedCmp?.id}`}
      >
        {selectedCmp && (
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-500">{selectedCmp.category}</span>
                <StatusBadge status={selectedCmp.status} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{selectedCmp.title}</h3>
              <p className="text-slate-500 mt-1">{selectedCmp.location}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assign Maintenance Technician
              </label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Manoj Kumar (Electrician)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Change Ticket Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['In Progress', 'Assigned', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(st)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-blue-600 hover:text-white font-bold transition text-center"
                  >
                    Set to {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
