import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { Megaphone, Search, Filter, Calendar, Building, CheckCircle2 } from 'lucide-react';

export const NoticesPage = () => {
  const { notices } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);

  const categories = ['All', 'Academic', 'Examination', 'Hostel', 'Events', 'Fees', 'Emergency'];

  const filteredNotices = notices.filter((n) => {
    const matchCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.department.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Campus Notice Center"
        subtitle="Official circulars and announcements from university administration and departments."
        badge={`${notices.length} Active Bulletins`}
      />

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notice title or dept..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* Notice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.length === 0 ? (
          <div className="col-span-1 md:col-span-2 p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            No active campus notices found.
          </div>
        ) : (
          filteredNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setSelectedNotice(notice)}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-blue-50 text-blue-700">
                  {notice.department}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">{notice.date}</span>
                  {notice.priority === 'High' || notice.priority === 'Emergency' ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 rounded-full">
                      {notice.priority}
                    </span>
                  ) : null}
                </div>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug">{notice.title}</h3>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{notice.content}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Read Full Notice</span>
              <span>→</span>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Notice Detail Modal */}
      <Modal
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        title="Official Circular"
      >
        {selectedNotice && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg">{selectedNotice.department}</span>
              <span className="text-slate-400 font-mono">{selectedNotice.date}</span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-lg">{selectedNotice.title}</h3>

            <div className="p-4 rounded-2xl bg-slate-50 text-slate-700 text-xs leading-relaxed space-y-2 whitespace-pre-line border border-slate-200">
              {selectedNotice.content}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Notice ID: {selectedNotice.id}</span>
              <span>Issued by Dean Academic Affairs</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
