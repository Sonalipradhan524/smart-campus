import React, { useState, useEffect } from 'react';
import { classSectionAPI, departmentAPI } from '../../services/api';
import { 
  Users, 
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

export const AdminClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    course: 'B.Tech',
    semester: '3rd Semester',
    section: 'Section A',
    department: '',
    teacher: 'Unassigned',
    subject: '',
    room: '',
    academicYear: '2026-27',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [clsData, deptData] = await Promise.all([
        classSectionAPI.getAll(),
        departmentAPI.getAll()
      ]);
      setClasses(clsData || []);
      setDepartments(deptData || []);
      if (deptData && deptData.length > 0 && !formData.department) {
        setFormData(prev => ({ ...prev, department: deptData[0].name }));
      }
    } catch (err) {
      setError(err.message || 'Unable to load classes & sections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({
        course: cls.course || 'B.Tech',
        semester: cls.semester || '3rd Semester',
        section: cls.section || 'Section A',
        department: cls.department || (departments[0]?.name || 'CSE'),
        teacher: cls.teacher || 'Unassigned',
        subject: cls.subject || '',
        room: cls.room || '',
        academicYear: cls.academicYear || '2026-27',
        status: cls.status || 'Active'
      });
    } else {
      setEditingClass(null);
      setFormData({
        course: 'B.Tech',
        semester: '3rd Semester',
        section: 'Section A',
        department: departments[0]?.name || 'CSE',
        teacher: 'Unassigned',
        subject: '',
        room: '',
        academicYear: '2026-27',
        status: 'Active'
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course || !formData.semester || !formData.section || !formData.department) {
      setFormError('Course, semester, section, and department are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editingClass) {
        await classSectionAPI.update(editingClass._id || editingClass.id, formData);
      } else {
        await classSectionAPI.create(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to save class/section.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete this class section?`)) return;
    try {
      await classSectionAPI.delete(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete class section.');
    }
  };

  const filteredClasses = classes.filter(cls => {
    return (cls.course || '').toLowerCase().includes(search.toLowerCase()) ||
           (cls.semester || '').toLowerCase().includes(search.toLowerCase()) ||
           (cls.section || '').toLowerCase().includes(search.toLowerCase()) ||
           (cls.department || '').toLowerCase().includes(search.toLowerCase()) ||
           (cls.teacher || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-600" />
            Class & Section Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage Course → Semester → Section academic allocations and teacher assignments</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Class / Section
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by course, semester, section, teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading classes & sections...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200/80 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No data available yet</h3>
          <p className="text-xs text-slate-500 mt-1">No class/section records found in the database. Click "Add Class / Section" to create allocations.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-4">Course</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Semester</th>
                  <th className="p-4">Section</th>
                  <th className="p-4">Assigned Teacher</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Room</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredClasses.map((cls) => (
                  <tr key={cls._id || cls.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold text-slate-900">{cls.course}</td>
                    <td className="p-4">{cls.department}</td>
                    <td className="p-4">{cls.semester}</td>
                    <td className="p-4 font-mono font-medium text-emerald-600">{cls.section}</td>
                    <td className="p-4 font-medium text-slate-800">{cls.teacher || 'Unassigned'}</td>
                    <td className="p-4 text-slate-500">{cls.subject || '-'}</td>
                    <td className="p-4 font-mono text-slate-600">{cls.room || '-'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        cls.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cls.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {cls.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(cls)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cls._id || cls.id)}
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
                {editingClass ? 'Edit Class / Section' : 'Add New Class / Section'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester *</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Section A"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Teacher</label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Ananya Roy"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Data Structures"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room No</label>
                  <input
                    type="text"
                    placeholder="e.g. 109"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
