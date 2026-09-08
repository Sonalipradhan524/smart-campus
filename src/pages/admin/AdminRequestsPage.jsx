import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Drawer } from '../../components/common/Drawer';
import { RequestTimeline } from '../../components/common/RequestTimeline';
import { FileText, CheckCircle2, XCircle, Eye, Search, Filter, AlertTriangle } from 'lucide-react';

export const AdminRequestsPage = () => {
  const { requests, updateRequestStatus } = useData();

  const [activeStatus, setActiveStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, reqId: null, targetStatus: null });
  // View detail drawer state
  const [selectedReq, setSelectedReq] = useState(null);

  const statuses = ['All', 'Pending', 'In Progress', 'Approved', 'Rejected', 'Completed'];

  const filteredRequests = requests.filter((r) => {
    const matchStatus = activeStatus === 'All' || r.status === activeStatus;
    const matchSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleOpenConfirm = (reqId, targetStatus) => {
    setConfirmModal({ isOpen: true, reqId, targetStatus });
  };

  const handleConfirmAction = () => {
    if (confirmModal.reqId && confirmModal.targetStatus) {
      updateRequestStatus(confirmModal.reqId, confirmModal.targetStatus);
    }
    setConfirmModal({ isOpen: false, reqId: null, targetStatus: null });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Admin Request Management"
        subtitle="Review, approve, or reject student gate passes, leave applications, and certificate requests."
        badge={`${requests.length} Requests Total`}
      />

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search request ID or student..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
            <tr>
              <th className="p-3">Request ID</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Request Type</th>
              <th className="p-3">Title & Details</th>
              <th className="p-3">Submitted Date</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  No requests matching active status filter.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{req.id}</td>
                  <td className="p-3 font-bold text-slate-800">{req.studentName || req.student || 'Student'}</td>
                  <td className="p-3 text-slate-600 font-bold">{req.type}</td>
                  <td className="p-3 text-slate-700 max-w-xs truncate">{req.title}</td>
                  <td className="p-3 text-slate-500">{req.submittedDate}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      req.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {req.priority || 'Medium'}
                    </span>
                  </td>
                  <td className="p-3"><StatusBadge status={req.status} /></td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedReq(req)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {req.status === 'Pending' || req.status === 'In Progress' ? (
                        <>
                          <button
                            onClick={() => handleOpenConfirm(req.id, 'Approved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleOpenConfirm(req.id, 'Rejected')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-[11px] flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-bold px-2">Decision Logged</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, reqId: null, targetStatus: null })}
        title="Confirm Administrative Action"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Action Confirmation</h4>
              <p className="mt-0.5">
                Are you sure you want to mark Request <strong>{confirmModal.reqId}</strong> as <strong>{confirmModal.targetStatus}</strong>? An automated notification will be sent to the student.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setConfirmModal({ isOpen: false, reqId: null, targetStatus: null })}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              className={`px-5 py-2 text-white font-bold rounded-xl shadow-md ${
                confirmModal.targetStatus === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Confirm {confirmModal.targetStatus}
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail Drawer */}
      <Drawer
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={`Request Audit: ${selectedReq?.id}`}
      >
        {selectedReq && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-500">{selectedReq.type}</span>
                <StatusBadge status={selectedReq.status} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{selectedReq.title}</h3>
              <p className="text-slate-500 mt-1">Submitted: {selectedReq.submittedDate}</p>
            </div>

            <RequestTimeline timeline={selectedReq.timeline} />
          </div>
        )}
      </Drawer>
    </div>
  );
};
