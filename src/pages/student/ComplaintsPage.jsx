import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { VoiceInputButton } from '../../components/common/VoiceInputButton';
import { triageComplaint, CATEGORY_DEFINITIONS } from '../../utils/triageHelper';
import {
  AlertTriangle,
  Sparkles,
  Camera,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  UserCheck,
  XCircle,
  Tag,
  Info,
} from 'lucide-react';

export const ComplaintsPage = () => {
  const { complaints, addComplaint } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Hostel Block B, Room 204');
  const [userCategory, setUserCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCmp, setSelectedCmp] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live transparent keyword triaging
  const triageResult = triageComplaint(title, description, userCategory);

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await addComplaint({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        category: triageResult.category,
        priority: triageResult.priority,
        assignedDept: triageResult.targetDept,
        imagePreview,
      });

      setTitle('');
      setDescription('');
      setImagePreview(null);
      setUserCategory('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Campus Grievance Desk"
        subtitle="Lodge hostel, electrical, plumbing, sanitation or IT complaints with automatic smart triaging & voice dictation."
        badge={`${complaints.length} Logged Tickets`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Filing Form (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Lodge a Grievance
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-700 rounded-full border border-teal-200 flex items-center gap-1">
              <Tag className="w-3 h-3 text-teal-600" /> Smart Triaging
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Grievance Title / Problem
                </label>
                <VoiceInputButton
                  currentValue={title}
                  onTranscript={(text) => setTitle(text)}
                  mode="append"
                />
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Water leakage in Room 204 or Fan regulator broken"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500 transition"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Location Details
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hostel Block B, Room 204 or Lab 3"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500 transition"
              />
            </div>

            {/* Category override option */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Category (Auto-Detected or Select)
              </label>
              <select
                value={userCategory || triageResult.category}
                onChange={(e) => setUserCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500 transition"
              >
                <option value="">-- Auto Detect from Keywords --</option>
                {CATEGORY_DEFINITIONS.map((def) => (
                  <option key={def.category} value={def.category}>
                    {def.category}
                  </option>
                ))}
                <option value="Other">Other / General</option>
              </select>
            </div>

            {/* Detailed Description with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Detailed Description
                </label>
                <VoiceInputButton
                  currentValue={description}
                  onTranscript={(text) => setDescription(text)}
                  mode="append"
                />
              </div>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the issue in detail. You can also use the microphone icon to dictate in English, Hindi, or Odia..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500 transition"
              />
            </div>

            {/* Keyword Triaging Banner */}
            {(title.trim().length > 2 || description.trim().length > 2) && (
              <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between font-bold text-teal-900">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" /> Triaged Department
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {triageResult.category}
                  </span>
                </div>
                <p className="text-slate-800 font-semibold">
                  Assigned to: <strong className="text-teal-900">{triageResult.targetDept}</strong>
                </p>
                <p className="text-[11px] text-slate-600 flex items-center gap-2">
                  <span>Priority: <strong>{triageResult.priority}</strong></span>
                  <span>•</span>
                  <span>Est. Resolution: <strong>{triageResult.estimatedResolution}</strong></span>
                </p>
                {triageResult.matchedKeywords && triageResult.matchedKeywords.length > 0 && (
                  <p className="text-[10px] text-teal-700 font-medium">
                    Matched keywords: {triageResult.matchedKeywords.join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Photo Attachment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Upload Photo Evidence (Optional)
              </label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-teal-400 bg-slate-50 p-3 rounded-2xl text-center cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-xs text-emerald-600 font-bold">Photo Attached</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                      }}
                      className="text-xs text-rose-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-1">
                    <Camera className="w-4 h-4 text-slate-400" />
                    <span>Click or drop photo here</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 hover:opacity-95 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Logging Ticket...' : 'Submit Grievance Ticket'}
            </button>
          </form>
        </div>

        {/* Complaints Tracking List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900">My Lodged Tickets</h3>
              <span className="text-xs font-bold text-slate-400">{complaints.length} Total</span>
            </div>

            {complaints.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">No grievances lodged yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Use the form on the left to submit maintenance, hostel, or IT issues.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <div
                    key={c.id || c.cmpId || c._id}
                    onClick={() => setSelectedCmp(c)}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-teal-300 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {c.cmpId || c.id}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 rounded-md">
                            {c.category}
                          </span>
                          <StatusBadge status={c.status} />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {c.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" />{' '}
                            {c.assignedDept || c.aiMetadata?.targetDept || 'Administration'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />{' '}
                            {c.submittedDate || 'Recently'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="text-xs font-bold text-teal-600 hover:underline">Track Updates →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Detail Modal */}
      <Modal
        isOpen={!!selectedCmp}
        onClose={() => setSelectedCmp(null)}
        title={`Grievance Details: ${selectedCmp?.cmpId || selectedCmp?.id}`}
      >
        {selectedCmp && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-500 uppercase">{selectedCmp.category}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{selectedCmp.title}</h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> {selectedCmp.location}
                </p>
              </div>
              <StatusBadge status={selectedCmp.status} />
            </div>

            {/* Department Assignment Details */}
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 text-slate-700 space-y-1">
              <p className="font-bold text-teal-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-700" /> Grievance Routing & Assignment
              </p>
              <p>
                Assigned Department:{' '}
                <strong>{selectedCmp.assignedDept || selectedCmp.aiMetadata?.targetDept || 'Campus Administrator'}</strong>
              </p>
              <p>
                Assigned Personnel:{' '}
                <strong>{selectedCmp.assignedTo || 'Unassigned / Pending Admin Dispatch'}</strong>
              </p>
              <p>
                Priority: <strong>{selectedCmp.priority || 'Medium'}</strong> • SLA:{' '}
                <strong>{selectedCmp.aiMetadata?.estimatedResolution || '24 - 48 Hours'}</strong>
              </p>
            </div>

            {/* Image Preview if available */}
            {selectedCmp.imagePreview && (
              <div>
                <p className="font-bold text-slate-800 mb-1">Attached Photo Evidence:</p>
                <img
                  src={selectedCmp.imagePreview}
                  alt="Complaint Evidence"
                  className="max-h-48 rounded-xl object-contain border border-slate-200 bg-slate-50 p-1"
                />
              </div>
            )}

            <div>
              <p className="font-bold text-slate-800 mb-1">Issue Description:</p>
              <p className="p-3 rounded-xl bg-slate-50 text-slate-600 leading-relaxed whitespace-pre-wrap">
                {selectedCmp.description}
              </p>
            </div>

            {/* Updates Timeline History */}
            <div>
              <p className="font-bold text-slate-800 mb-2">Resolution Status History:</p>
              <div className="space-y-2">
                {(selectedCmp.updates && selectedCmp.updates.length > 0 ? selectedCmp.updates : [
                  {
                    status: selectedCmp.status,
                    date: selectedCmp.submittedDate || 'Recently',
                    note: 'Complaint submitted.',
                    updatedBy: 'Student',
                  }
                ]).map((u, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5"
                  >
                    {u.status === 'Resolved' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : u.status === 'Rejected' ? (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{u.status || 'Update'}</span>
                        <span className="text-[10px] text-slate-400">{u.date}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{u.note}</p>
                      {u.updatedBy && (
                        <p className="text-[10px] text-slate-400 mt-1">Updated by: {u.updatedBy}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
