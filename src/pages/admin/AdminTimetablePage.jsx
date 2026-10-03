import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import {
  Calendar,
  Plus,
  MapPin,
  Users,
  Search,
  Filter,
  Edit2,
  Trash2,
  BookOpen,
  Clock,
  Layers,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const BRANCHES = [
  'CSE',
  'CSEDS',
  'ECE',
  'EE',
  'MECH',
  'CIVIL',
  'CIVIL & ENV',
  'AERO',
  'AGRI',
  'M&M'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ROOMS = ['109', '208', '310', '207', '305', 'LAB'];

const CLASS_TYPES = ['Lecture', 'Lab', 'Library', 'Sports/Yoga', 'Lunch Break'];

const TEACHER_CODES = [
  'SSM',
  'MKS',
  'AKB',
  'CKP',
  'AM',
  'SLM',
  'SS',
  'BKM',
  'RD',
  'GM',
  'SPS',
  'NF-1',
  'RS'
];

export const AdminTimetablePage = () => {
  const { timetable, refreshTimetable, addTimetableSlot, updateTimetableSlot, deleteTimetableSlot } = useData();

  // Filters
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [selectedTeacher, setSelectedTeacher] = useState('All');
  const [selectedClassType, setSelectedClassType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Form State
  const initialForm = {
    day: 'Monday',
    roomNo: '109',
    branch: 'CSE',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    time: '9-10 AM',
    subject: 'DS',
    code: 'CSE-301',
    teacher: 'SSM',
    classType: 'Lecture',
    semester: '3rd Semester',
    course: 'B.Tech',
    academicYear: '2026-27',
    effectiveFrom: '20-07-2026',
    status: 'Verified'
  };

  const [formData, setFormData] = useState(initialForm);

  // Filtered dataset
  const filteredTimetable = useMemo(() => {
    return timetable.filter(slot => {
      const matchBranch = selectedBranch === 'All' || (slot.branch || '').toUpperCase() === selectedBranch.toUpperCase();
      const matchDay = selectedDay === 'All' || slot.day === selectedDay;
      const matchRoom = selectedRoom === 'All' || (slot.roomNo || slot.room || '') === selectedRoom;
      const matchTeacher = selectedTeacher === 'All' || (slot.teacher || slot.faculty || '') === selectedTeacher;
      const matchType = selectedClassType === 'All' || slot.classType === selectedClassType;
      const matchSearch =
        !searchQuery ||
        (slot.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (slot.teacher || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (slot.code || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchBranch && matchDay && matchRoom && matchTeacher && matchType && matchSearch;
    });
  }, [timetable, selectedBranch, selectedDay, selectedRoom, selectedTeacher, selectedClassType, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingSlot(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slot) => {
    setEditingSlot(slot);
    setFormData({
      day: slot.day || 'Monday',
      roomNo: slot.roomNo || slot.room || '109',
      branch: slot.branch || 'CSE',
      startTime: slot.startTime || '09:00 AM',
      endTime: slot.endTime || '10:00 AM',
      time: slot.time || '9-10 AM',
      subject: slot.subject || '',
      code: slot.code || '',
      teacher: slot.teacher || slot.faculty || 'SSM',
      classType: slot.classType || 'Lecture',
      semester: slot.semester || '3rd Semester',
      course: slot.course || 'B.Tech',
      academicYear: slot.academicYear || '2026-27',
      effectiveFrom: slot.effectiveFrom || '20-07-2026',
      status: slot.status || 'Verified'
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        faculty: formData.teacher,
        time: `${formData.startTime} - ${formData.endTime}`
      };

      if (editingSlot) {
        await updateTimetableSlot(editingSlot.id || editingSlot._id, payload);
      } else {
        await addTimetableSlot(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable class slot?')) {
      await deleteTimetableSlot(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Admin Timetable & Room Allocation Management"
        subtitle="Manage 3rd Semester B.Tech timetable entries, room allocations, and faculty load schedules."
        badge="Master Control"
        icon={Calendar}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshTimetable()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            title="Refresh DB Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Add Class Slot
          </button>
        </div>
      </PageHeader>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{timetable.length}</span>
            <p className="text-xs text-slate-500 font-bold">Total DB Entries</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{ROOMS.length}</span>
            <p className="text-xs text-slate-500 font-bold">Active Rooms / Labs</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{BRANCHES.length}</span>
            <p className="text-xs text-slate-500 font-bold">B.Tech Branches</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{TEACHER_CODES.length}</span>
            <p className="text-xs text-slate-500 font-bold">Faculty Codes</p>
          </div>
        </div>
      </div>

      {/* Filter Control Console */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Master Filter Console</h3>
          </div>
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search subject, teacher, code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Branch</label>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="All">All Branches</option>
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Day</label>
            <select
              value={selectedDay}
              onChange={e => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="All">All Days</option>
              {DAYS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Room No</label>
            <select
              value={selectedRoom}
              onChange={e => setSelectedRoom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="All">All Rooms</option>
              {ROOMS.map(r => (
                <option key={r} value={r}>Room {r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Teacher Code</label>
            <select
              value={selectedTeacher}
              onChange={e => setSelectedTeacher(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="All">All Teachers</option>
              {TEACHER_CODES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Class Type</label>
            <select
              value={selectedClassType}
              onChange={e => setSelectedClassType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="All">All Class Types</option>
              {CLASS_TYPES.map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Master Data Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base">
            Master Timetable Records ({filteredTimetable.length} Records Shown)
          </h3>
          <span className="text-xs text-slate-500 font-medium">Source of Truth Dataset</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
              <tr>
                <th className="p-3">Day</th>
                <th className="p-3">Room No</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Time Slot</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Teacher</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredTimetable.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    No matching timetable slots found in the database.
                  </td>
                </tr>
              ) : (
                filteredTimetable.map(slot => (
                  <tr key={slot.id || slot._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-extrabold text-slate-900">{slot.day}</td>
                    <td className="p-3 font-bold text-teal-700">Room {slot.roomNo || slot.room}</td>
                    <td className="p-3 font-black text-slate-900">{slot.branch}</td>
                    <td className="p-3 text-slate-600 font-bold">{slot.time}</td>
                    <td className="p-3 font-bold">{slot.subject}</td>
                    <td className="p-3 font-extrabold text-indigo-700">{slot.teacher || slot.faculty}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-md uppercase">
                        {slot.classType}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(slot)}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="Edit Entry"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id || slot._id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Timetable Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSlot ? 'Edit Timetable Entry' : 'Add New Class Slot'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Day</label>
              <select
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {DAYS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Branch</label>
              <select
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Room No</label>
              <select
                value={formData.roomNo}
                onChange={e => setFormData({ ...formData, roomNo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {ROOMS.map(r => (
                  <option key={r} value={r}>Room {r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Class Type</label>
              <select
                value={formData.classType}
                onChange={e => setFormData({ ...formData, classType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {CLASS_TYPES.map(ct => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Start Time</label>
              <input
                type="text"
                placeholder="09:00 AM"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">End Time</label>
              <input
                type="text"
                placeholder="10:00 AM"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Subject Name</label>
              <input
                type="text"
                placeholder="Subject (e.g. PYTHON, OOPS)"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Teacher Code</label>
              <input
                type="text"
                placeholder="Teacher Code (e.g. SSM, MKS)"
                value={formData.teacher}
                onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Semester</label>
              <input
                type="text"
                value={formData.semester}
                onChange={e => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Academic Year</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Effective From</label>
              <input
                type="text"
                value={formData.effectiveFrom}
                onChange={e => setFormData({ ...formData, effectiveFrom: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              {editingSlot ? 'Save Changes' : 'Create Slot'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
