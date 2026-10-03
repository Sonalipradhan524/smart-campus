import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
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
  Eye, 
  AlertCircle 
} from 'lucide-react';

export const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    rollNo: '',
    department: 'CSE',
    course: 'B.Tech',
    semester: '3rd Semester',
    section: 'Section A',
    admissionYear: '2026',
    dob: '',
    gender: 'Male',
    hostel: 'Kalpana Chawla Hall (Block B)',
    roomNo: '-',
    guardianName: '',
    guardianPhone: '',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getStudents();
      setStudents(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load student directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenForm = (st = null) => {
    if (st) {
      setEditingStudent(st);
      setFormData({
        name: st.name || '',
        email: st.email || '',
        phone: st.phone || '',
        studentId: st.studentId || st.rollNo || '',
        rollNo: st.rollNo || st.studentId || '',
        department: st.department || st.branch || 'CSE',
        course: st.course || 'B.Tech',
        semester: st.semester || '3rd Semester',
        section: st.section || 'Section A',
        admissionYear: st.admissionYear || '2026',
        dob: st.dob || '',
        gender: st.gender || 'Male',
        hostel: st.hostel || 'Unassigned',
        roomNo: st.roomNo || '-',
        guardianName: st.guardianName || '',
        guardianPhone: st.guardianPhone || '',
        status: st.status || 'Active'
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        studentId: '',
        rollNo: '',
        department: 'CSE',
        course: 'B.Tech',
        semester: '3rd Semester',
        section: 'Section A',
        admissionYear: '2026',
        dob: '',
        gender: 'Male',
        hostel: 'Unassigned',
        roomNo: '-',
        guardianName: '',
        guardianPhone: '',
        status: 'Active'
      });
    }
    setFormError('');
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || (!formData.rollNo && !formData.studentId)) {
      setFormError('Name, Email, and Student ID/Roll Number are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editingStudent) {
        await adminAPI.updateStudent(editingStudent._id || editingStudent.id, formData);
      } else {
        await adminAPI.createStudent(formData);
      }
      setShowFormModal(false);
      fetchStudents();
    } catch (err) {
      setFormError(err.message || 'Failed to save student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) return;
    try {
      await adminAPI.deleteStudent(id);
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Failed to delete student.');
    }
  };

  const handleToggleStatus = async (st) => {
    const newStatus = st.status === 'Inactive' ? 'Active' : 'Inactive';
    try {
      await adminAPI.updateStudent(st._id || st.id, { status: newStatus });
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Failed to update student status.');
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (s.studentId || s.rollNo || '').toLowerCase().includes(search.toLowerCase()) ||
                          (s.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || (s.department || s.branch) === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-teal-600" />
            Student Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage real student registrations, profiles, academic standing, and status</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search name, student ID, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Departments</option>
            {['CSE', 'ECE', 'EE', 'MECH', 'CIVIL', 'AERO', 'AGRI', 'CSEDS', 'M&M'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table / State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading student directory...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200/80 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No data available yet</h3>
          <p className="text-xs text-slate-500 mt-1">No student records found in the database matching your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-4">Student ID / Roll</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Semester & Sec</th>
                  <th className="p-4">Hostel / Room</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredStudents.map((st) => (
                  <tr key={st._id || st.id || st.studentId} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono font-bold text-teal-600">{st.studentId || st.rollNo}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{st.name}</div>
                      <div className="text-[11px] text-slate-400">{st.email}</div>
                    </td>
                    <td className="p-4">{st.department || st.branch}</td>
                    <td className="p-4">{st.semester} ({st.section || 'A'})</td>
                    <td className="p-4 text-slate-500">{st.hostel || 'Unassigned'} ({st.roomNo || '-'})</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(st)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          st.status !== 'Inactive' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {st.status !== 'Inactive' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {st.status || 'Active'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => { setSelectedStudent(st); setShowViewModal(true); }}
                        className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenForm(st)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(st._id || st.id, st.name)}
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
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Student Profile Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-medium">Full Name</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedStudent.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Student ID / Roll</span>
                  <span className="font-mono font-bold text-teal-600 text-sm">{selectedStudent.studentId || selectedStudent.rollNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Email</span>
                  <span className="text-slate-700">{selectedStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone</span>
                  <span className="text-slate-700">{selectedStudent.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Department</span>
                  <span className="text-slate-700 font-semibold">{selectedStudent.department || selectedStudent.branch}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Course & Semester</span>
                  <span className="text-slate-700">{selectedStudent.course || 'B.Tech'} ({selectedStudent.semester})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Section</span>
                  <span className="text-slate-700">{selectedStudent.section || 'A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Hostel & Room</span>
                  <span className="text-slate-700">{selectedStudent.hostel || 'Unassigned'} ({selectedStudent.roomNo || '-'})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Guardian Name</span>
                  <span className="text-slate-700">{selectedStudent.guardianName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Guardian Phone</span>
                  <span className="text-slate-700">{selectedStudent.guardianPhone || 'N/A'}</span>
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
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student ID / Roll *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value, rollNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {['CSE', 'ECE', 'EE', 'MECH', 'CIVIL', 'AERO', 'AGRI', 'CSEDS', 'M&M'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingStudent ? 'Update Student' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
