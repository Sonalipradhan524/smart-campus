import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Calendar, Clock, MapPin, BookOpen, User, Layers, RefreshCw } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

export const TeacherTimetablePage = () => {
  const { user } = useAuth();
  const { timetable, refreshTimetable } = useData();

  // Extract teacher code from user profile or default to SSM / AM
  const defaultTeacherCode = useMemo(() => {
    if (user?.teacherCode && TEACHER_CODES.includes(user.teacherCode.toUpperCase())) {
      return user.teacherCode.toUpperCase();
    }
    if (user?.name) {
      const match = TEACHER_CODES.find(code => user.name.toUpperCase().includes(code));
      if (match) return match;
    }
    return 'SSM';
  }, [user]);

  const [selectedTeacherCode, setSelectedTeacherCode] = useState(defaultTeacherCode);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Filter timetable for this teacher
  const teacherTimetable = useMemo(() => {
    return timetable.filter(t => {
      const codeNorm = selectedTeacherCode.toLowerCase();
      const tTeacher = (t.teacher || '').toLowerCase();
      const tFaculty = (t.faculty || '').toLowerCase();
      return tTeacher.includes(codeNorm) || tFaculty.includes(codeNorm);
    });
  }, [timetable, selectedTeacherCode]);

  const daySlots = useMemo(() => {
    return teacherTimetable.filter(t => t.day === selectedDay);
  }, [teacherTimetable, selectedDay]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Faculty Academic Load & Class Schedule"
        subtitle={`Viewing assigned slots for Teacher Code: ${selectedTeacherCode}`}
        icon={Calendar}
      >
        <button
          onClick={() => refreshTimetable({ teacher: selectedTeacherCode })}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Schedule
        </button>
      </PageHeader>

      {/* Teacher Code Selector & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Selector card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs md:col-span-2 space-y-3">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
            Select Teacher Code
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {TEACHER_CODES.map(code => (
              <button
                key={code}
                onClick={() => setSelectedTeacherCode(code)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition whitespace-nowrap ${
                  selectedTeacherCode === code
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Load summary card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Weekly Teaching Load</span>
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="py-2">
            <h3 className="text-3xl font-black">{teacherTimetable.length}</h3>
            <p className="text-xs text-indigo-200 mt-0.5">Assigned Class Slots / Week</p>
          </div>
          <p className="text-[11px] text-indigo-300/80 border-t border-indigo-800/80 pt-2 font-medium">
            Effective AY 2026-27 • 3rd Semester B.Tech
          </p>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition whitespace-nowrap ${
              selectedDay === day
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Day Slots */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Classes for {selectedDay} (Code: {selectedTeacherCode})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              3rd Semester B.Tech Timetable
            </p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-xl">
            {daySlots.length} Lectures Scheduled
          </span>
        </div>

        {daySlots.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No classes assigned on {selectedDay} for teacher {selectedTeacherCode}.</p>
            <p className="text-xs text-slate-400 mt-1">Select another day or teacher code above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {daySlots.map((slot, idx) => (
              <div
                key={slot.id || slot._id || idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold rounded-md uppercase">
                      Branch: {slot.branch}
                    </span>
                    <h4 className="font-black text-slate-900 text-base mt-1.5">{slot.subject}</h4>
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-200 text-slate-800 font-black text-xs rounded-xl shadow-2xs">
                    {slot.time}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-semibold pt-2 border-t border-slate-200/60">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    Room: <strong className="text-slate-900">{slot.roomNo}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    Type: <strong className="text-slate-900">{slot.classType}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Assigned Classes Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">Complete Assigned Load Matrix ({selectedTeacherCode})</h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
              <tr>
                <th className="p-3">Day</th>
                <th className="p-3">Time</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Room</th>
                <th className="p-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {teacherTimetable.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400">
                    No classes found for teacher code {selectedTeacherCode}.
                  </td>
                </tr>
              ) : (
                teacherTimetable.map(slot => (
                  <tr key={slot.id || slot._id} className="hover:bg-slate-50">
                    <td className="p-3 font-extrabold text-slate-900">{slot.day}</td>
                    <td className="p-3 text-indigo-600 font-bold">{slot.time}</td>
                    <td className="p-3 font-extrabold">{slot.branch}</td>
                    <td className="p-3">{slot.subject}</td>
                    <td className="p-3">{slot.roomNo}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                        {slot.classType}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
