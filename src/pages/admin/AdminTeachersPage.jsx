import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Eye, 
  AlertCircle,
  Mail,
  Phone,
  Building2
} from 'lucide-react';

export const AdminTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    qualification: 'M.Tech in CSE',
    specialization: 'Software Engineering',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getTeachers();
      setTeachers(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load faculty directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpenForm = (t = null) => {
    if (t) {
      setEditingTeacher(t);
      setFormData({
        name: t.name || '',
        email: t.email || '',
        phone: t.phone || '',
        employeeId: t.employeeId || '',
        department: t.department || 'Computer Science & Engineering',
        designation: t.designation || 'Assistant Professor',
        qualification: t.qualification || '',
        specialization: t.specialization || '',
        status: t.status || 'Active'
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        employeeId: '',
        department: 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        qualification: 'M.Tech in CSE',
        specialization: 'Software Engineering',
        status: 'Active'
      });
    }
    setFormError('');
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Name and Email are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editingTeacher) {
        await adminAPI.updateTeacher(editingTeacher._id || editingTeacher.id, formData);
      } else {
        await adminAPI.createTeacher(formData);
      }
      setShowFormModal(false);
      fetchTeachers();
    } catch (err) {
      setFormError(err.message || 'Failed to save faculty record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete faculty member "${name}"?`)) return;
    try {
      await adminAPI.deleteTeacher(id);
      fetchTeachers();
    } catch (err) {
      alert(err.message || 'Failed to delete faculty member.');
    }
  };

  const handleToggleStatus = async (t) => {
    const newStatus = t.status === 'Inactive' ? 'Active' : 'Inactive';
    try {
      await adminAPI.updateTeacher(t._id || t.id, { status: newStatus });
      fetchTeachers();
    } catch (err) {
      alert(err.message || 'Failed to update faculty status.');
    }
  };

  const filteredTeachers = teachers.filter(t => {
    return (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
           (t.employeeId || '').toLowerCase().includes(search.toLowerCase()) ||
           (t.department || '').toLowerCase().includes(search.toLowerCase()) ||
           (t.email || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-indigo-600" />
            Teacher / Faculty Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage real faculty members, designations, qualifications, and account status</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Faculty Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search faculty by name, employee ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading faculty directory...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200/80 text-center">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No data available yet</h3>
          <p className="text-xs text-slate-500 mt-1">No faculty members found in the database. Click "Add Faculty Member" to register real teachers.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-4">Employee ID</th>
                  <th className="p-4">Faculty Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredTeachers.map((t) => (
                  <tr key={t._id || t.id || t.employeeId} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono font-bold text-indigo-600">{t.employeeId}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{t.name}</div>
                      <div className="text-[11px] text-slate-400">{t.specialization || 'Faculty'}</div>
                    </td>
                    <td className="p-4 font-medium">{t.department}</td>
                    <td className="p-4 text-slate-600">{t.designation || 'Lecturer'}</td>
                    <td className="p-4 text-slate-500">
                      <div>{t.email}</div>
                      <div className="text-[10px] text-slate-400">{t.phone || '-'}</div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(t)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.status !== 'Inactive' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.status !== 'Inactive' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {t.status || 'Active'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => { setSelectedTeacher(t); setShowViewModal(true); }}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenForm(t)}
                        className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id || t.id, t.name)}
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

      {/* View Modal */}
      {showViewModal && selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Faculty Member Profile</h3>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-medium">Full Name</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedTeacher.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Employee ID</span>
                  <span className="font-mono font-bold text-indigo-600 text-sm">{selectedTeacher.employeeId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Department</span>
                  <span className="text-slate-700 font-semibold">{selectedTeacher.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Designation</span>
                  <span className="text-slate-700">{selectedTeacher.designation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Qualification</span>
                  <span className="text-slate-700">{selectedTeacher.qualification || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Specialization</span>
                  <span className="text-slate-700">{selectedTeacher.specialization || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Email</span>
                  <span className="text-slate-700">{selectedTeacher.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone</span>
                  <span className="text-slate-700">{selectedTeacher.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingTeacher ? 'Edit Faculty Record' : 'Register Faculty Member'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-1">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FAC-CSE-004"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingTeacher ? 'Update Record' : 'Register Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
