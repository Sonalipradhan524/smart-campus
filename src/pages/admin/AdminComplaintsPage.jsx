import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { VoiceInputButton } from '../../components/common/VoiceInputButton';
import { CATEGORY_DEFINITIONS } from '../../utils/triageHelper';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  UserCheck,
  XCircle,
  Edit,
  Save,
  User,
} from 'lucide-react';

export const AdminComplaintsPage = () => {
  const { complaints, updateComplaintStatus } = useData();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedCmp, setSelectedCmp] = useState(null);
  const [staffName, setStaffName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [targetStatus, setTargetStatus] = useState('In Progress');
  const [internalNote, setInternalNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = ['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];

  const filtered = complaints.filter((c) => activeTab === 'All' || c.status === activeTab);

  const openDrawer = (c) => {
    setSelectedCmp(c);
    setStaffName(c.assignedTo && c.assignedTo !== 'Unassigned' ? c.assignedTo : '');
    setSelectedCategory(c.category || 'Plumbing');
    setSelectedDept(c.assignedDept || c.aiMetadata?.targetDept || 'Campus Administrator');
    setTargetStatus(c.status || 'In Progress');
    setInternalNote('');
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const def = CATEGORY_DEFINITIONS.find((d) => d.category === cat);
    if (def) {
      setSelectedDept(def.targetDept);
    }
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!selectedCmp) return;

    setIsSaving(true);
    try {
      const cmpId = selectedCmp.cmpId || selectedCmp.id || selectedCmp._id;
      await updateComplaintStatus(cmpId, {
        status: targetStatus,
        assignedTo: staffName.trim() || 'Unassigned',
        category: selectedCategory,
        assignedDept: selectedDept,
        note: internalNote.trim() || `Ticket status marked as ${targetStatus}.`,
      });
      setSelectedCmp(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Administrative Grievance Desk"
        subtitle="Review transparent keyword-triaged tickets, assign technicians, update status, and manage resolution timelines."
        badge={`${complaints.length} Total Tickets`}
      />

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        {tabs.map((tab) => {
          const count = tab === 'All' ? complaints.length : complaints.filter((c) => c.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Complaints Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center">
          <p className="font-bold text-slate-700 text-sm">No tickets under "{activeTab}" status</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div
              key={c.cmpId || c.id || c._id}
              onClick={() => openDrawer(c)}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-400 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-slate-500">{c.cmpId || c.id}</span>
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

                {/* Routing & Assignment Information */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  <p className="font-bold text-teal-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" /> Dept:{' '}
                    {c.assignedDept || c.aiMetadata?.targetDept || 'Campus Administrator'}
                  </p>
                  <p className="text-slate-600">
                    Assigned Staff:{' '}
                    <strong className="text-slate-900">{c.assignedTo || 'Unassigned'}</strong>
                  </p>
                  {c.studentName && (
                    <p className="text-slate-500 text-[10px]">
                      Student: {c.studentName} {c.rollNo ? `(${c.rollNo})` : ''}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
                <span>Manage & Update Ticket</span>
                <span className="flex items-center gap-1">
                  <Edit className="w-3.5 h-3.5" /> Action →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Complaint Action Drawer */}
      <Drawer
        isOpen={!!selectedCmp}
        onClose={() => setSelectedCmp(null)}
        title={`Grievance Control: ${selectedCmp?.cmpId || selectedCmp?.id}`}
      >
        {selectedCmp && (
          <form onSubmit={handleSaveUpdate} className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500 uppercase tracking-wider">{selectedCmp.category}</span>
                <StatusBadge status={selectedCmp.status} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">{selectedCmp.title}</h3>
              <p className="text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-400" /> {selectedCmp.location}
              </p>
              {selectedCmp.studentName && (
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Student: <strong>{selectedCmp.studentName}</strong> (Roll: {selectedCmp.rollNo || 'N/A'}) • Hostel:{' '}
                  {selectedCmp.hostel || 'Campus'}
                </p>
              )}
            </div>

            {/* Description display */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Original Complaint Description
              </label>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedCmp.description}
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Change Ticket Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTargetStatus(st)}
                    className={`py-2 px-2.5 rounded-xl border font-bold text-[11px] transition text-center cursor-pointer ${
                      targetStatus === st
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Reassign Category & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                >
                  {CATEGORY_DEFINITIONS.map((def) => (
                    <option key={def.category} value={def.category}>
                      {def.category}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Department
                </label>
                <input
                  type="text"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                />
              </div>
            </div>

            {/* Assign Staff Technician */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assign Staff / Maintenance Technician
              </label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Manoj Kumar (Estate Electrician) or IT Support"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500 transition"
              />
            </div>

            {/* Resolution Note with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  Internal / Student Update Note
                </label>
                <VoiceInputButton
                  currentValue={internalNote}
                  onTranscript={(text) => setInternalNote(text)}
                  mode="append"
                />
              </div>
              <textarea
                rows={2}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="e.g. Technician dispatched to Room 204. Issue resolved..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500 transition"
              />
            </div>

            {/* Updates History */}
            <div>
              <p className="font-bold text-slate-800 mb-2">Previous Status Logs:</p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                {(selectedCmp.updates || []).map((u, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{u.status || 'Update'}</span>
                      <span className="text-[10px] text-slate-400">{u.date}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{u.note}</p>
                    {u.updatedBy && <p className="text-[10px] text-slate-400 mt-0.5">By: {u.updatedBy}</p>}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 hover:bg-teal-700 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Updating Ticket...' : 'Save & Apply Status Update'}
            </button>
          </form>
        )}
      </Drawer>
    </div>
  );
};
