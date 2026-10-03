import React, { useState, useEffect } from 'react';
import { courseAPI, departmentAPI } from '../../services/api';
import { 
  BookOpen, 
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

export const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    duration: '4 Years (8 Semesters)',
    description: '',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [crsData, deptData] = await Promise.all([
        courseAPI.getAll(),
        departmentAPI.getAll()
      ]);
      setCourses(crsData || []);
      setDepartments(deptData || []);
      if (deptData && deptData.length > 0 && !formData.department) {
        setFormData(prev => ({ ...prev, department: deptData[0].name }));
      }
    } catch (err) {
      setError(err.message || 'Unable to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (crs = null) => {
    if (crs) {
      setEditingCourse(crs);
      setFormData({
        name: crs.name || '',
        code: crs.code || '',
        department: crs.department || (departments[0]?.name || 'Computer Science & Engineering'),
        duration: crs.duration || '4 Years (8 Semesters)',
        description: crs.description || '',
        status: crs.status || 'Active'
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        code: '',
        department: departments[0]?.name || 'Computer Science & Engineering',
        duration: '4 Years (8 Semesters)',
        description: '',
        status: 'Active'
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.department) {
      setFormError('Course name, code, and department are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editingCourse) {
        await courseAPI.update(editingCourse._id || editingCourse.id, formData);
      } else {
        await courseAPI.create(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to save course.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the course "${name}"?`)) return;
    try {
      await courseAPI.delete(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete course.');
    }
  };

  const filteredCourses = courses.filter(crs => {
    const matchesSearch = (crs.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (crs.code || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || crs.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Course Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage degree programs, durations, and department associations</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by course name, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d._id || d.id || d.code} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200/80 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No data available yet</h3>
          <p className="text-xs text-slate-500 mt-1">No courses found in the database. Click "Add Course" to enter real courses.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredCourses.map((crs) => (
                  <tr key={crs._id || crs.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold text-slate-900">{crs.name}</td>
                    <td className="p-4 font-mono font-medium text-indigo-600">{crs.code}</td>
                    <td className="p-4">{crs.department}</td>
                    <td className="p-4 text-slate-500">{crs.duration || '-'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        crs.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {crs.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {crs.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(crs)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(crs._id || crs.id, crs.name)}
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
                {editingCourse ? 'Edit Course' : 'Add New Course'}
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
                <label className="block font-semibold text-slate-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Technology (B.Tech)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BTECH-CSE"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Engineering"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 4 Years (8 Semesters)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingCourse ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
