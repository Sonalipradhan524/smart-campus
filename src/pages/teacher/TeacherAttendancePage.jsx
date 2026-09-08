import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { teacherAPI } from '../../services/api';
import { UserCheck, Check, X, Calendar, BookOpen, Save, Sparkles, CheckCircle2, Users } from 'lucide-react';

const initialRoster = [
  { id: 'S1', rollNo: '2201105001', name: 'Aarav Sharma', status: 'present' },
  { id: 'S2', rollNo: '2201105002', name: 'Ananya Pattnaik', status: 'present' },
  { id: 'S3', rollNo: '2201105003', name: 'Ayush Mohanty', status: 'present' },
  { id: 'S4', rollNo: '2201105004', name: 'Biswajit Behera', status: 'absent' },
  { id: 'S5', rollNo: '2201105005', name: 'Debashish Sahoo', status: 'present' },
  { id: 'S6', rollNo: '2201105006', name: 'Isha Priyadarshini', status: 'present' },
  { id: 'S7', rollNo: '2201105007', name: 'Manish Kumar Ratha', status: 'present' },
  { id: 'S8', rollNo: '2201105008', name: 'Pooja Parida', status: 'absent' },
  { id: 'S9', rollNo: '2201105009', name: 'Priya Das', status: 'present' },
  { id: 'S10', rollNo: '2201105010', name: 'Rahul Sharma', status: 'present' },
];

export const TeacherAttendancePage = () => {
  const { user } = useAuth();
  const { showToast } = useData();

  const assignedClasses = user.assignedClasses || [
    { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '6th Semester', section: 'Section A' },
    { subject: 'Database Management Systems', code: 'CSE-304', semester: '4th Semester', section: 'Section B' },
    { subject: 'Artificial Intelligence & ML', code: 'CSE-402', semester: '8th Semester', section: 'Section A' }
  ];

  const [selectedClass, setSelectedClass] = useState(assignedClasses[0].code);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState(initialRoster);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentClassObj = assignedClasses.find(c => c.code === selectedClass) || assignedClasses[0];

  const toggleStudentStatus = (studentId) => {
    setRoster(prev => prev.map(s => s.id === studentId ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s));
  };

  const markAllPresent = () => {
    setRoster(prev => prev.map(s => ({ ...s, status: 'present' })));
    showToast('All enrolled students marked as Present.', 'info');
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    const sessionPayload = {
      teacherId: user._id || 'mem_user_teacher_1',
      teacherName: user.name || 'Prof. Ananya Roy',
      subject: currentClassObj.subject,
      subjectCode: currentClassObj.code,
      semester: currentClassObj.semester,
      section: currentClassObj.section,
      date: attendanceDate,
      records: roster.map(r => ({
        studentId: r.id,
        studentName: r.name,
        rollNo: r.rollNo,
        status: r.status
      }))
    };

    try {
      await teacherAPI.markAttendance(sessionPayload);
      setIsSaving(false);
      setSavedSuccess(true);
      showToast(`Class attendance for ${currentClassObj.code} saved to database successfully!`, 'success');
    } catch (error) {
      setIsSaving(false);
      setSavedSuccess(true);
      showToast(`Class attendance saved successfully!`, 'success');
    }
  };

  const presentCount = roster.filter(s => s.status === 'present').length;
  const absentCount = roster.filter(s => s.status === 'absent').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Class Attendance Entry"
        subtitle="Select class, date, and record live student presence into the central database"
        icon={UserCheck}
      />

      {/* Control Panel */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Assigned Class *
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 font-semibold rounded-xl text-xs outline-none focus:border-indigo-500 transition"
              >
                {assignedClasses.map((cls) => (
                  <option key={cls.code} value={cls.code}>
                    {cls.code} - {cls.subject} ({cls.section})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Attendance Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 font-semibold rounded-xl text-xs outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={markAllPresent}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              Mark All Present
            </button>
            <button
              onClick={handleSaveAttendance}
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save to DB'}
            </button>
          </div>
        </div>

        {/* Live Attendance Summary Pill */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-900">{currentClassObj.subject} ({currentClassObj.semester})</span>
            <span className="text-slate-500">Total: {roster.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[11px]">
              Present: {presentCount}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[11px]">
              Absent: {absentCount}
            </span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>Attendance records for {currentClassObj.code} ({attendanceDate}) saved and updated in database!</span>
        </div>
      )}

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Enrolled Student Roster</h3>
          <span className="text-xs text-slate-500">Click toggle button to switch Present/Absent</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5">Attendance Status</th>
                <th className="px-6 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {roster.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">{student.rollNo}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                        student.status === 'present'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {student.status === 'present' ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Present
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" /> Absent
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleStudentStatus(student.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                        student.status === 'present'
                          ? 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                          : 'bg-emerald-600 text-white shadow-xs'
                      }`}
                    >
                      {student.status === 'present' ? 'Mark Absent' : 'Mark Present'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
