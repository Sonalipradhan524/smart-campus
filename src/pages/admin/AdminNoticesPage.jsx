import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { VoiceInputButton } from '../../components/common/VoiceInputButton';
import { Megaphone, Plus, Send, CheckCircle2 } from 'lucide-react';

export const AdminNoticesPage = () => {
  const { notices, publishNotice } = useData();

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Examination Cell');
  const [category, setCategory] = useState('Academic');
  const [priority, setPriority] = useState('High');
  const [content, setContent] = useState('');

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    publishNotice({
      title,
      department,
      category,
      priority,
      content,
    });

    setTitle('');
    setContent('');
    setShowPublishModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notice Publishing & Circular Dispatch"
        subtitle="Broadcast official university circulars, exam notifications, and emergency alerts."
        badge={`${notices.length} Published`}
      >
        <button
          onClick={() => setShowPublishModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Publish New Notice
        </button>
      </PageHeader>

      {/* Published Notices Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
            <tr>
              <th className="p-3">Notice ID</th>
              <th className="p-3">Department</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Date Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {notices.map((n) => (
              <tr key={n.id || n.noticeId || n._id} className="hover:bg-slate-50 transition">
                <td className="p-3 font-mono font-bold text-slate-900">{n.noticeId || n.id}</td>
                <td className="p-3 font-bold text-teal-700">{n.department}</td>
                <td className="p-3 text-slate-900 font-bold max-w-sm truncate">{n.title}</td>
                <td className="p-3 text-slate-600">{n.category}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      n.priority === 'Emergency' || n.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {n.priority}
                  </span>
                </td>
                <td className="p-3 text-slate-500">{n.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Publish Notice Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Publish Official Campus Circular"
      >
        <form onSubmit={handlePublish} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Notice Title
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
              placeholder="e.g. Mid-Semester Examination Schedule & Guidelines"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issuing Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value="Examination Cell">Examination Cell</option>
                <option value="Hostel Administration">Hostel Administration</option>
                <option value="Academic Registrar">Academic Registrar</option>
                <option value="Innovation Cell">Innovation Cell</option>
                <option value="Accounts & Finance">Accounts & Finance</option>
                <option value="Campus Security & Proctor">Campus Security & Proctor</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority Tag
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Emergency">Emergency Alert</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Notice Content / Full Details
              </label>
              <VoiceInputButton
                currentValue={content}
                onTranscript={(text) => setContent(text)}
                mode="append"
              />
            </div>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full circular announcement body. You can also dictate using voice..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPublishModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-teal-500/20 hover:bg-teal-700 transition cursor-pointer"
            >
              <Send className="w-4 h-4" /> Broadcast Notice Campus-Wide
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
