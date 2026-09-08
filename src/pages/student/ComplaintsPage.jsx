import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { AlertTriangle, Sparkles, Camera, Send, CheckCircle2, Clock, MapPin, User, FileText } from 'lucide-react';

export const ComplaintsPage = () => {
  const { complaints, addComplaint } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Hostel Block B, Room 204');
  const [category, setCategory] = useState('Electrical');
  const [priority, setPriority] = useState('Medium');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCmp, setSelectedCmp] = useState(null);

  // Live Smart AI Classification Simulation
  const getSimulatedAIClassification = () => {
    const text = (title + ' ' + description).toLowerCase();
    if (text.includes('fan') || text.includes('light') || text.includes('wire') || text.includes('switch')) {
      return { cat: 'Electrical', prio: 'Medium', dept: 'Estate Electrical Cell', est: '4 Hours' };
    }
    if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('tap')) {
      return { cat: 'Plumbing / Water', prio: 'High', dept: 'Sanitation Dept', est: '2 Hours' };
    }
    if (text.includes('wifi') || text.includes('internet') || text.includes('net')) {
      return { cat: 'Internet & IT', prio: 'High', dept: 'Computer Center IT', est: '12 Hours' };
    }
    return { cat: category, prio: priority, dept: 'General Maintenance', est: '24 Hours' };
  };

  const aiPreview = getSimulatedAIClassification();

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addComplaint({
      title,
      description,
      location,
      category: aiPreview.cat,
      priority: aiPreview.prio,
      imagePreview,
    });

    setTitle('');
    setDescription('');
    setImagePreview(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Campus Grievance Desk"
        subtitle="Log hostel, electrical, sanitation or IT complaints with automated Smart AI routing."
        badge={`${complaints.length} Logged Tickets`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Filing Form (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Lodge a Grievance
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-700 rounded-full border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" /> AI Classified
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Grievance Title / Problem
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fan regulator broken or water tap leaking"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Location Details
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hostel Block B, Room 204"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Detailed Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue clearly..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            {/* Smart AI Classification Banner Simulation */}
            {title.length > 3 && (
              <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs space-y-1 animate-fade-in">
                <div className="flex items-center justify-between font-bold text-purple-900">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Classification Preview
                  </span>
                  <span className="text-[10px] text-purple-600">97% Match</span>
                </div>
                <p className="text-slate-700">Category: <strong>{aiPreview.cat}</strong> • Priority: <strong>{aiPreview.prio}</strong></p>
                <p className="text-[11px] text-slate-500">Auto-routes to: {aiPreview.dept} (Est: {aiPreview.est})</p>
              </div>
            )}

            {/* Image Upload UI */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Upload Photo Evidence (Optional)
              </label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 p-3 rounded-2xl text-center cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="flex items-center gap-3">
                    <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
                    <span className="text-xs text-emerald-600 font-bold">Image Attached</span>
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
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Grievance Ticket
            </button>
          </form>
        </div>

        {/* Complaints Tracking List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-4">Lodged Grievance Tickets</h3>

            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCmp(c)}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-400">{c.id}</span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 rounded-md">
                          {c.category}
                        </span>
                        <StatusBadge status={c.status} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {c.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> Est: {c.aiMetadata?.estimatedResolution}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-xs font-bold text-blue-600 hover:underline">Track Updates →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Detail Modal */}
      <Modal
        isOpen={!!selectedCmp}
        onClose={() => setSelectedCmp(null)}
        title={`Grievance Details: ${selectedCmp?.id}`}
      >
        {selectedCmp && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-500 uppercase">{selectedCmp.category}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{selectedCmp.title}</h3>
              </div>
              <StatusBadge status={selectedCmp.status} />
            </div>

            {/* AI Metadata Badge */}
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-slate-700 space-y-1">
              <p className="font-bold text-purple-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Smart AI Routing Details
              </p>
              <p>Assigned Dept: <strong>{selectedCmp.aiMetadata?.targetDept}</strong></p>
              <p>Estimated Resolution: <strong>{selectedCmp.aiMetadata?.estimatedResolution}</strong></p>
              <p>Assigned Staff: <strong>{selectedCmp.assignedTo}</strong></p>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1">Issue Description:</p>
              <p className="p-3 rounded-xl bg-slate-50 text-slate-600 leading-relaxed">{selectedCmp.description}</p>
            </div>

            {/* Updates History */}
            <div>
              <p className="font-bold text-slate-800 mb-2">Resolution Updates History:</p>
              <div className="space-y-2">
                {selectedCmp.updates.map((u, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">{u.note}</p>
                      <p className="text-[10px] text-slate-400">{u.date}</p>
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
