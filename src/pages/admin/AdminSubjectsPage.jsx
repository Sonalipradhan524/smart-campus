import React, { useState, useEffect } from 'react';
import { subjectAPI, departmentAPI } from '../../services/api';
import { 
  FileText, 
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

export const AdminSubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    course: 'B.Tech',
    semester: '3rd Semester',
    credits: 3,
    subjectType: 'Theory',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [subData, deptData] = await Promise.all([
        subjectAPI.getAll(),
        departmentAPI.getAll()
      ]);
      setSubjects(subData || []);
      setDepartments(deptData || []);
      if (deptData && deptData.length > 0 && !formData.department) {
        setFormData(prev => ({ ...prev, department: deptData[0].name }));
      }
    } catch (err) {
      setError(err.message || 'Unable to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (sub = null) => {
    if (sub) {
      setEditingSubject(sub);
      setFormData({
        name: sub.name || '',
        code: sub.code || '',
        department: sub.department || (departments[0]?.name || 'CSE'),
        course: sub.course || 'B.Tech',
        semester: sub.semester || '3rd Semester',
        credits: sub.credits || 3,
        subjectType: sub.subjectType || 'Theory',
        status: sub.status || 'Active'
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: '',
        code: '',
        department: departments[0]?.name || 'CSE',
        course: 'B.Tech',
        semester: '3rd Semester',
        credits: 3,
        subjectType: 'Theory',
        status: 'Active'
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.department) {
      setFormError('Subject name, code, and department are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editingSubject) {
        await subjectAPI.update(editingSubject._id || editingSubject.id, formData);
      } else {
        await subjectAPI.create(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to save subject.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the subject "${name}"?`)) return;
    try {
      await subjectAPI.delete(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete subject.');
    }
  };

  const filteredSubjects = subjects.filter(sub => {
    const matchesSearch = (sub.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (sub.code || '').toLowerCase().includes(search.toLowerCase()) ||
                          (sub.department || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || sub.subjectType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-purple-600" />
            Subject Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage theory, lab, and elective subjects across courses & semesters</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by subject name, code, dept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Types</option>
            <option value="Theory">Theory</option>
            <option value="Practical">Practical</option>
            <option value="Lab">Lab</option>
            <option value="Elective">Elective</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading subjects...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200/80 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No data available yet</h3>
          <p className="text-xs text-slate-500 mt-1">No subjects found in the database. Click "Add Subject" to create real course subjects.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-4">Subject Name</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Department / Course</th>
                  <th className="p-4">Semester</th>
                  <th className="p-4">Credits</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredSubjects.map((sub) => (
                  <tr key={sub._id || sub.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold text-slate-900">{sub.name}</td>
                    <td className="p-4 font-mono font-medium text-purple-600">{sub.code}</td>
                    <td className="p-4">{sub.department} ({sub.course || 'B.Tech'})</td>
                    <td className="p-4">{sub.semester || '3rd Semester'}</td>
                    <td className="p-4 font-bold text-slate-800">{sub.credits || 3}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {sub.subjectType || 'Theory'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        sub.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {sub.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {sub.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(sub)}
                        className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id || sub.id, sub.name)}
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
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                  {formError}
                </div>
              )}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE-301"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Engineering"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Type</label>
                  <select
                    value={formData.subjectType}
                    onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Practical">Practical</option>
                    <option value="Lab">Lab</option>
                    <option value="Elective">Elective</option>
                  </select>
                </div>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingSubject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
