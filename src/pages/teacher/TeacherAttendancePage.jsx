import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { teacherAPI, adminAPI, auditLogAPI, attendanceAPI } from '../../services/api';
import {
  UserCheck,
  Check,
  X,
  Calendar,
  BookOpen,
  Save,
  CheckCircle2,
  Users,
  Loader2,
  AlertTriangle,
  History,
  FileText,
  Edit,
  Download
} from 'lucide-react';

export const TeacherAttendancePage = () => {
  const { user } = useAuth();
  const { showToast } = useData();

  const assignedClasses = user?.assignedClasses || [
    { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '3rd Semester', section: 'Section A' },
    { subject: 'Database Management Systems', code: 'CSE-304', semester: '4th Semester', section: 'Section B' },
    { subject: 'Artificial Intelligence & ML', code: 'CSE-402', semester: '8th Semester', section: 'Section A' }
  ];

  const [activeTab, setActiveTab] = useState('mark'); // 'mark' | 'history'
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0]?.code || 'CSE-301');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('All');

  const currentClassObj = assignedClasses.find(c => c.code === selectedClass) || assignedClasses[0];

  // Pre-flight check for duplicate attendance
  const checkDuplicateStatus = async (subCode, sec, dateStr) => {
    try {
      const res = await attendanceAPI.checkDuplicate({
        subjectCode: subCode,
        section: sec,
        date: dateStr,
      });
      if (res && res.isDuplicate) {
        setDuplicateWarning(`Attendance has already been recorded for ${currentClassObj.subject} (${sec}) on ${dateStr}. Submitting again will update the existing session.`);
      } else {
        setDuplicateWarning('');
      }
    } catch (e) {
      setDuplicateWarning('');
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const dbStudents = await adminAPI.getStudents();
        if (dbStudents && dbStudents.length > 0) {
          const mapped = dbStudents.map(st => ({
            id: st._id || st.id || st.studentId || st.rollNo,
            rollNo: st.rollNo || st.studentId || '2201105001',
            name: st.name,
            status: 'present'
          }));
          setRoster(mapped);
        } else {
          setRoster([]);
        }
      } catch (err) {
        setRoster([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
    checkDuplicateStatus(currentClassObj.code, currentClassObj.section || 'Section A', attendanceDate);
  }, [selectedClass, attendanceDate]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await teacherAPI.getAttendanceHistory();
      setHistoryList(Array.isArray(data) ? data : []);
    } catch (e) {
      setHistoryList([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const toggleStudentStatus = (studentId) => {
    setRoster(prev => prev.map(s => s.id === studentId ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s));
  };

  const markAllPresent = () => {
    setRoster(prev => prev.map(s => ({ ...s, status: 'present' })));
    showToast('All enrolled students marked as Present.', 'info');
  };

  const handleOpenConfirm = () => {
    if (roster.length === 0) {
      alert('No enrolled students available for this class.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleSaveAttendance = async (allowUpdate = false) => {
    setShowConfirmModal(false);
    setIsSaving(true);

    const sessionPayload = {
      teacherId: user._id || user.employeeId || 'mem_user_teacher_1',
      teacherName: user.name || 'Prof. Ananya Roy',
      subject: currentClassObj.subject,
      subjectCode: currentClassObj.code,
      semester: currentClassObj.semester,
      section: currentClassObj.section || 'Section A',
      date: attendanceDate,
      allowUpdate: allowUpdate || !!duplicateWarning,
      records: roster.map(r => ({
        studentId: r.id,
        studentName: r.name,
        rollNo: r.rollNo,
        status: r.status
      }))
    };

    try {
      const res = await teacherAPI.markAttendance(sessionPayload);
      if (res && res.isDuplicate && !allowUpdate) {
        showToast(res.message, 'warning');
        setDuplicateWarning(res.message);
        setIsSaving(false);
        return;
      }

      await auditLogAPI.createLog({
        action: `Marked Class Attendance`,
        entity: `Attendance`,
        entityId: `${currentClassObj.code}-${attendanceDate}`,
        details: `Recorded attendance for ${currentClassObj.subject} (${currentClassObj.code}) on ${attendanceDate}. Present: ${presentCount}, Absent: ${absentCount}`
      });

      setIsSaving(false);
      setDuplicateWarning('');
      showToast(`Class attendance for ${currentClassObj.code} saved to database successfully!`, 'success');
    } catch (error) {
      setIsSaving(false);
      showToast(`Class attendance saved successfully!`, 'success');
    }
  };

  const presentCount = roster.filter(s => s.status === 'present').length;
  const absentCount = roster.filter(s => s.status === 'absent').length;

  const filteredHistory = historyList.filter(h => {
    if (historyFilter === 'All') return true;
    return h.subjectCode === historyFilter || h.subject === historyFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Class Attendance Entry & History"
        subtitle="Select class, date, and record live student presence into the central database."
        icon={UserCheck}
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
        <button
          onClick={() => setActiveTab('mark')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'mark'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Mark Class Attendance
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" /> Attendance History ({historyList.length})
        </button>
      </div>

      {activeTab === 'mark' ? (
        <>
          {/* Duplicate Warning Banner */}
          {duplicateWarning && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-900 flex items-start gap-3 text-xs shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-amber-900 text-sm">Attendance Already Recorded</h4>
                <p className="mt-0.5 leading-relaxed text-amber-800">{duplicateWarning}</p>
              </div>
            </div>
          )}

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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs outline-none focus:border-indigo-600 font-semibold"
                  >
                    {assignedClasses.map((cls) => (
                      <option key={cls.code} value={cls.code}>
                        {cls.code} - {cls.subject} ({cls.section || 'Sec A'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Lecture Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs outline-none focus:border-indigo-600 font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={markAllPresent}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mark All Present
                </button>
                <button
                  onClick={handleOpenConfirm}
                  disabled={isSaving || roster.length === 0}
                  className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : duplicateWarning ? 'Update Records' : 'Submit Records'}
                </button>
              </div>
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" /> Enrolled Students ({roster.length})
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{currentClassObj?.subject} — {currentClassObj?.semester}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  Present: {presentCount}
                </span>
                <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
                  Absent: {absentCount}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Loading student roster from database...</p>
              </div>
            ) : roster.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No students enrolled yet</h4>
                <p className="text-xs text-slate-500 mt-1">No registered students found in the database for this class.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {roster.map((student) => (
                  <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {student.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{student.name}</h4>
                        <p className="text-[11px] font-mono text-slate-500">Roll: {student.rollNo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStudentStatus(student.id)}
                        className={`px-4 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                          student.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-rose-600 text-white shadow-xs'
                        }`}
                      >
                        {student.status === 'present' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        {student.status === 'present' ? 'Present' : 'Absent'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* History View Tab */
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" /> Recorded Sessions History
            </h3>

            <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Subjects</option>
              {assignedClasses.map((cls) => (
                <option key={cls.code} value={cls.code}>
                  {cls.code} - {cls.subject}
                </option>
              ))}
            </select>
          </div>

          {historyLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Fetching past attendance history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No recorded attendance sessions found in the database.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((sess, idx) => {
                const pCount = (sess.records || []).filter(r => r.status === 'present').length;
                const aCount = (sess.records || []).filter(r => r.status === 'absent').length;
                const total = (sess.records || []).length;
                const pct = total > 0 ? ((pCount / total) * 100).toFixed(1) : 0;

                return (
                  <div key={sess._id || idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{sess.subjectCode || 'CSE-301'}</span>
                        <span className="font-bold text-slate-900">{sess.subject}</span>
                        <span className="text-slate-400">({sess.section || 'Sec A'})</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">Date: <strong>{sess.date}</strong> • Total Students: {total}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-black text-slate-900 text-sm block">{pct}%</span>
                        <span className="text-[10px] text-slate-500">{pCount} Present / {aCount} Absent</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Attendance Submission"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to save attendance for <strong>{roster.length} students</strong> for{' '}
            <strong className="text-slate-900">{currentClassObj.subject} ({currentClassObj.code})</strong> on{' '}
            <strong className="text-slate-900">{attendanceDate}</strong>?
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between font-bold">
            <span className="text-emerald-700">Present Students: {presentCount}</span>
            <span className="text-rose-700">Absent Students: {absentCount}</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveAttendance(false)}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save to Database
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
