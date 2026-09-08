import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
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
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
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
              <tr key={n.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-slate-900">{n.id}</td>
                <td className="p-3 font-bold text-blue-700">{n.department}</td>
                <td className="p-3 text-slate-900 font-bold max-w-sm truncate">{n.title}</td>
                <td className="p-3 text-slate-600">{n.category}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    n.priority === 'Emergency' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
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
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notice Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mid-Semester Examination Schedule"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
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
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notice Content / Full Details
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full circular announcement body..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPublishModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" /> Broadcast Notice Campus-Wide
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
