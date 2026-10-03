import React, { useState, useEffect } from 'react';
import { departmentAPI } from '../../services/api';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingDep, setEditingDep] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    hod: 'Unassigned',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await departmentAPI.getAll();
      setDepartments(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load departments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenModal = (dep = null) => {
    if (dep) {
      setEditingDep(dep);
      setFormData({
        name: dep.name || '',
        code: dep.code || '',
        description: dep.description || '',
        hod: dep.hod || 'Unassigned',
        status: dep.status || 'Active'
      });
    } else {
      setEditingDep(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        hod: 'Unassigned',
        status: 'Active'
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setFormError('Department name and code are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editingDep) {
        await departmentAPI.update(editingDep._id || editingDep.id, formData);
      } else {
        await departmentAPI.create(formData);
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      setFormError(err.message || 'Failed to save department.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the department "${name}"?`)) return;
    try {
      await departmentAPI.delete(id);
      fetchDepartments();
    } catch (err) {
      alert(err.message || 'Failed to delete department.');
    }
  };

  const filteredDepartments = departments.filter(dep => {
    const matchesSearch = (dep.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (dep.code || '').toLowerCase().includes(search.toLowerCase()) ||
                          (dep.hod || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || dep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-teal-600" />
            Department Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage academic departments, HOD assignments, and status</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, code, HOD..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading departments...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200/80 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No data available yet</h3>
          <p className="text-xs text-slate-500 mt-1">No departments matching your criteria were found in the database.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-4">Department Name</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Head of Dept (HOD)</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredDepartments.map((dep) => (
                  <tr key={dep._id || dep.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold text-slate-900">{dep.name}</td>
                    <td className="p-4 font-mono font-medium text-teal-600">{dep.code}</td>
                    <td className="p-4">{dep.hod || 'Unassigned'}</td>
                    <td className="p-4 max-w-xs truncate text-slate-500">{dep.description || '-'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        dep.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {dep.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {dep.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(dep)}
                        className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dep._id || dep.id, dep.name)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingDep ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                  {formError}
                </div>
              )}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Engineering"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Head of Department (HOD)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. A. K. Swain"
                  value={formData.hod}
                  onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief overview of department..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingDep ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
