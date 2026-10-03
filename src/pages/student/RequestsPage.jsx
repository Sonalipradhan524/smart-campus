import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { RequestTimeline } from '../../components/common/RequestTimeline';
import { FileText, Calendar, Eye, Search, Filter } from 'lucide-react';

export const RequestsPage = () => {
  const { requests } = useData();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedReq, setSelectedReq] = useState(null);
  const [search, setSearch] = useState('');

  const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Completed'];

  const filteredRequests = requests.filter((req) => {
    const matchesTab =
      activeTab === 'All'
        ? true
        : activeTab === 'Pending'
        ? req.status === 'Pending' || req.status === 'In Progress'
        : req.status === activeTab;

    const reqIdStr = (req.reqId || req.id || req._id || '').toString().toLowerCase();
    const titleStr = (req.title || '').toString().toLowerCase();
    const typeStr = (req.type || '').toString().toLowerCase();
    const searchStr = (search || '').toLowerCase();

    const matchesSearch =
      reqIdStr.includes(searchStr) ||
      titleStr.includes(searchStr) ||
      typeStr.includes(searchStr);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Requests & Applications"
        subtitle="Track the real-time status and approval timeline of all your submitted permits."
        badge={`${requests.length} Total Requests`}
      />

      {/* Filters & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search request ID or title..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
          />
        </div>
      </div>

      {/* Requests List Grid */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No requests found</h3>
            <p className="text-xs text-slate-400 mt-1">There are no requests matching your current filter.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-400">{req.id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                      {req.type}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{req.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>Submitted: {req.submittedDate}</span>
                    <span>•</span>
                    <span>Updated: {req.lastUpdated}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button
                  onClick={() => setSelectedReq(req)}
                  className="px-4 py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <Eye className="w-4 h-4" /> View Details & Timeline
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Drawer */}
      <Drawer
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={`Request Details: ${selectedReq?.id}`}
      >
        {selectedReq && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">{selectedReq.type}</span>
                <StatusBadge status={selectedReq.status} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{selectedReq.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Submitted on {selectedReq.submittedDate}</p>
            </div>

            {/* Custom Details */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">Submission Details</h4>
              {Object.entries(selectedReq.details || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="capitalize font-medium text-slate-500">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">{String(val)}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <RequestTimeline timeline={selectedReq.timeline} />
          </div>
        )}
      </Drawer>
    </div>
  );
};
