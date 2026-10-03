import React, { useState, useEffect } from 'react';
import { requestsAPI, complaintsAPI, auditLogAPI } from '../../services/api';
import { 
  GitPullRequest, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  Loader2, 
  FileText, 
  AlertTriangle,
  DoorOpen,
  Calendar,
  Award,
  AlertCircle
} from 'lucide-react';

export const AdminWorkflowCenterPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'leave' | 'gate-pass' | 'certificate' | 'complaints'
  const [requests, setRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState('request'); // 'request' | 'complaint'
  const [showModal, setShowModal] = useState(false);
  const [actionStatus, setActionStatus] = useState('Approved');
  const [adminResponse, setAdminResponse] = useState('');
  const [assignedTo, setAssignedTo] = useState('Unassigned');
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkflowData = async () => {
    setLoading(true);
    setError('');
    try {
      const [reqData, cmpData] = await Promise.all([
        requestsAPI.getAll(),
        complaintsAPI.getAll()
      ]);
      setRequests(reqData || []);
      setComplaints(cmpData || []);
    } catch (err) {
      setError(err.message || 'Unable to load workflow records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const handleOpenActionModal = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
    setActionStatus(type === 'request' ? (item.status === 'Approved' ? 'Approved' : 'Approved') : 'In Progress');
    setAdminResponse('');
    setAssignedTo(item.assignedTo || 'Maintenance Staff');
    setShowModal(true);
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      if (itemType === 'request') {
        await requestsAPI.updateStatus(selectedItem._id || selectedItem.id || selectedItem.reqId, actionStatus, adminResponse);
        await auditLogAPI.createLog({
          action: `${actionStatus} Request`,
          entity: 'Request',
          entityId: selectedItem.reqId || selectedItem._id,
          details: `Updated request "${selectedItem.title || selectedItem.type}" status to ${actionStatus}. Remarks: ${adminResponse}`
        });
      } else {
        await complaintsAPI.updateStatus(selectedItem._id || selectedItem.id || selectedItem.cmpId, actionStatus, assignedTo);
        await auditLogAPI.createLog({
          action: `Updated Complaint Status to ${actionStatus}`,
          entity: 'Complaint',
          entityId: selectedItem.cmpId || selectedItem._id,
          details: `Assigned to: ${assignedTo}. Remarks: ${adminResponse}`
        });
      }
      setShowModal(false);
      fetchWorkflowData();
    } catch (err) {
      alert(err.message || 'Failed to update workflow item.');
    } finally {
      setSubmitting(false);
    }
  };

  // Combine & filter
  const filteredRequests = requests.filter(r => {
    if (activeTab === 'leave' && r.type !== 'Leave Application') return false;
    if (activeTab === 'gate-pass' && r.type !== 'Gate Pass') return false;
    if (activeTab === 'certificate' && r.type !== 'Certificate') return false;
    if (activeTab === 'complaints') return false;
    const matchesSearch = (r.studentName || r.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (r.reqId || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (r.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredComplaints = complaints.filter(c => {
    if (activeTab !== 'all' && activeTab !== 'complaints') return false;
    const matchesSearch = (c.studentName || c.title || c.category || '').toLowerCase().includes(search.toLowerCase()) ||
                          (c.cmpId || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (c.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <GitPullRequest className="w-6 h-6 text-teal-600" />
            Campus Workflow Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review, assign, approve, and resolve student leave applications, gate passes, certificates, and complaints</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'All Workflows', icon: GitPullRequest },
          { id: 'leave', label: 'Leave Applications', icon: Calendar },
          { id: 'gate-pass', label: 'Gate Passes', icon: DoorOpen },
          { id: 'certificate', label: 'Certificate Requests', icon: Award },
          { id: 'complaints', label: 'Grievances & Complaints', icon: AlertTriangle },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, ID, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading workflow records...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </div>
      ) : filteredRequests.length === 0 && filteredComplaints.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200/80 text-center">
          <GitPullRequest className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No workflow records available</h3>
          <p className="text-xs text-slate-500 mt-1">No requests or complaints matching your criteria were found in the database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Requests Table */}
          {filteredRequests.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>Student Requests ({filteredRequests.length})</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                      <th className="p-3">Request ID</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Student</th>
                      <th className="p-3">Reason / Details</th>
                      <th className="p-3">Submitted</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map(r => (
                      <tr key={r._id || r.reqId} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-teal-600">{r.reqId || r._id}</td>
                        <td className="p-3 font-semibold text-slate-900">{r.type || r.title}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{r.studentName}</div>
                          <div className="text-[10px] text-slate-400">{r.rollNo}</div>
                        </td>
                        <td className="p-3 max-w-xs truncate text-slate-600">{r.reason || r.title || '-'}</td>
                        <td className="p-3 text-slate-500">{r.submittedDate || r.startDate || 'Recent'}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            r.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {r.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenActionModal(r, 'request')}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800"
                          >
                            Process
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Complaints Table */}
          {filteredComplaints.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>Student Complaints & Grievances ({filteredComplaints.length})</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                      <th className="p-3">Complaint ID</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Student</th>
                      <th className="p-3">Title & Location</th>
                      <th className="p-3">Assigned Staff</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredComplaints.map(c => (
                      <tr key={c._id || c.cmpId} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-purple-600">{c.cmpId || c._id}</td>
                        <td className="p-3 font-semibold text-slate-900">{c.category}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{c.studentName}</div>
                          <div className="text-[10px] text-slate-400">{c.hostel || 'Hostel'} {c.roomNo}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{c.title}</div>
                          <div className="text-[10px] text-slate-400">{c.location}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{c.assignedTo || 'Unassigned'}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            c.status === 'In Progress' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {c.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenActionModal(c, 'complaint')}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workflow Processing Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Process {itemType === 'request' ? 'Request' : 'Complaint'} ({selectedItem.reqId || selectedItem.cmpId || selectedItem._id})
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">✕</button>
            </div>
            <form onSubmit={handleActionSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Submitted By</span>
                <span className="font-bold text-slate-800">{selectedItem.studentName} ({selectedItem.rollNo || selectedItem.hostel || 'Student'})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Reason / Details</span>
                <p className="text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-200 mt-1">
                  {selectedItem.reason || selectedItem.description || selectedItem.title}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Set Status *</label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {itemType === 'request' ? (
                    <>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </>
                  ) : (
                    <>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </>
                  )}
                </select>
              </div>

              {itemType === 'complaint' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign to Staff Member</label>
                  <input
                    type="text"
                    placeholder="e.g. Maintenance Dept / Warden Dr. S. K. Nayak"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Response / Remarks</label>
                <textarea
                  rows="3"
                  placeholder="Official response sent to student..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
