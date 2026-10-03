import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { VoiceInputButton } from '../../components/common/VoiceInputButton';
import { Megaphone, Plus, Calendar, Send } from 'lucide-react';

export const TeacherNoticesPage = () => {
  const { user } = useAuth();
  const { notices = [], publishNotice } = useData();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await publishNotice({
      title: title.trim(),
      content: content.trim(),
      category: 'Academic',
      department: user?.department || 'Computer Science & Engineering',
      priority: 'Medium',
      postedBy: `Prof. ${user?.name || 'Faculty'}`,
    });

    setTitle('');
    setContent('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Class Bulletins & Academic Notices"
        subtitle="Publish announcements to enrolled students and view campus notices with voice-to-text input."
        icon={Megaphone}
        actionButton={{
          label: 'Publish Class Notice',
          icon: Plus,
          onClick: () => setShowModal(true),
        }}
      />

      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id || notice._id}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {notice.department || 'Academic'}
              </span>
              <span className="text-slate-400">{notice.date || 'Today'}</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">{notice.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
            <p className="text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-100">
              Published by: {notice.postedBy || 'Faculty'}
            </p>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Publish Class Notice">
        <form onSubmit={handlePublish} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Notice Title *</label>
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
              placeholder="e.g. Extra Lab Session for CSE-301"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Announcement Details *</label>
              <VoiceInputButton
                currentValue={content}
                onTranscript={(text) => setContent(text)}
                mode="append"
              />
            </div>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write announcement text or dictate with voice..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-slate-100 font-bold rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:bg-indigo-700 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Publish Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
