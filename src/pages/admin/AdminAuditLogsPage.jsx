import React, { useState, useEffect } from 'react';
import { auditLogAPI } from '../../services/api';
import { 
  ShieldCheck, 
  Search, 
  Loader2, 
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await auditLogAPI.getLogs();
      setLogs(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load system audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    return (log.userName || '').toLowerCase().includes(search.toLowerCase()) ||
           (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
           (log.entity || '').toLowerCase().includes(search.toLowerCase()) ||
           (log.logId || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            System Audit Trail & Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">Immutable security log of administrative actions, workflow approvals, and database modifications</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by user, action, entity ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading audit logs...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200/80 text-center">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No audit logs available yet</h3>
          <p className="text-xs text-slate-500 mt-1">System audit events will be automatically recorded as administrative actions occur.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredLogs.map(log => (
                  <tr key={log._id || log.logId} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-slate-900">{log.logId || log._id}</td>
                    <td className="p-4 text-slate-500">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{log.userName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-teal-600">{log.action}</td>
                    <td className="p-4">{log.entity} {log.entityId ? `(${log.entityId})` : ''}</td>
                    <td className="p-4 max-w-xs truncate text-slate-500">{log.details || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
