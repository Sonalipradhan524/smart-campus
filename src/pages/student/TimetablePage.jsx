import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Calendar,
  MapPin,
  User,
  Clock,
  Filter,
  BookOpen,
  Sparkles,
  Coffee,
  Activity,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Search
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

const TIME_SLOTS = [
  '9-10 AM',
  '10-11 AM',
  '11-12 NOON',
  '12-1 PM',
  '1-2 PM',
  '2-3 PM',
  '3-4 PM'
];

export const TimetablePage = () => {
  const { user } = useAuth();
  const { timetable, refreshTimetable } = useData();

  // Auto-detect student profile branch and day
  const defaultBranch = useMemo(() => {
    if (user?.branch && BRANCHES.includes(user.branch.toUpperCase())) {
      return user.branch.toUpperCase();
    }
    if (user?.department) {
      const dep = user.department.toUpperCase();
      const match = BRANCHES.find(b => dep.includes(b));
      if (match) return match;
    }
    return 'CSE';
  }, [user]);

  const currentDayName = useMemo(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[new Date().getDay()];
    return DAYS.includes(today) ? today : 'Monday';
  }, []);

  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedDay, setSelectedDay] = useState(currentDayName);
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'
  const [filterSubject, setFilterSubject] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterClassType, setFilterClassType] = useState('All');

  // Filtered timetable for selected branch
  const branchTimetable = useMemo(() => {
    return timetable.filter(t => {
      const matchBranch = (t.branch || 'CSE').toUpperCase() === selectedBranch.toUpperCase();
      const matchSub = !filterSubject || (t.subject || '').toLowerCase().includes(filterSubject.toLowerCase());
      const matchTeacher = !filterTeacher || (t.teacher || '').toLowerCase().includes(filterTeacher.toLowerCase());
      const matchRoom = !filterRoom || (t.roomNo || t.room || '').toLowerCase() === filterRoom.toLowerCase();
      const matchType = filterClassType === 'All' || t.classType === filterClassType;
      return matchBranch && matchSub && matchTeacher && matchRoom && matchType;
    });
  }, [timetable, selectedBranch, filterSubject, filterTeacher, filterRoom, filterClassType]);

  const dayTimetable = useMemo(() => {
    return branchTimetable.filter(t => t.day === selectedDay);
  }, [branchTimetable, selectedDay]);

  // Determine Current and Next class based on local time
  const classStatus = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const todaySlots = branchTimetable.filter(t => t.day === currentDayName);

    let current = null;
    let next = null;

    if (currentHour >= 9 && currentHour < 10) {
      current = todaySlots.find(s => s.time.includes('9-10'));
      next = todaySlots.find(s => s.time.includes('10-11'));
    } else if (currentHour >= 10 && currentHour < 11) {
      current = todaySlots.find(s => s.time.includes('10-11'));
      next = todaySlots.find(s => s.time.includes('11-12'));
    } else if (currentHour >= 11 && currentHour < 12) {
      current = todaySlots.find(s => s.time.includes('11-12'));
      next = todaySlots.find(s => s.time.includes('12-1'));
    } else if (currentHour >= 12 && currentHour < 13) {
      current = todaySlots.find(s => s.classType === 'Lunch Break' || s.time.includes('12-1'));
      next = todaySlots.find(s => s.time.includes('1-2'));
    } else if (currentHour >= 13 && currentHour < 14) {
      current = todaySlots.find(s => s.time.includes('1-2'));
      next = todaySlots.find(s => s.time.includes('2-3'));
    } else if (currentHour >= 14 && currentHour < 15) {
      current = todaySlots.find(s => s.time.includes('2-3') || s.time.includes('2-4'));
      next = todaySlots.find(s => s.time.includes('3-4'));
    } else if (currentHour >= 15 && currentHour < 16) {
      current = todaySlots.find(s => s.time.includes('3-4') || s.time.includes('2-4'));
    } else if (currentHour < 9) {
      next = todaySlots.find(s => s.time.includes('9-10'));
    }

    return { current, next };
  }, [branchTimetable, currentDayName]);

  const getClassBadgeStyle = (type) => {
    switch (type) {
      case 'Lab':
        return 'bg-amber-500/10 text-amber-600 border-amber-200/50';
      case 'Library':
        return 'bg-purple-500/10 text-purple-600 border-purple-200/50';
      case 'Sports/Yoga':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50';
      case 'Lunch Break':
        return 'bg-orange-500/10 text-orange-600 border-orange-200/50';
      default:
        return 'bg-teal-500/10 text-teal-600 border-teal-200/50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <PageHeader
        title="3rd Semester B.Tech Academic Timetable"
        subtitle="Official BPUT Autonomous Schedule • Effective From: 20-07-2026 • AY 2026-27"
        badge={`Branch: ${selectedBranch}`}
        icon={Calendar}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => refreshTimetable({ branch: selectedBranch })}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
            title="Refresh Timetable"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'day' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day Schedule
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'week' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Grid
            </button>
          </div>
        </div>
      </PageHeader>

      {/* Live Class Highlights Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Class */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-600 to-indigo-700 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Clock className="w-36 h-36" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Current Slot (Live)
            </span>
            <span className="text-xs text-teal-100 font-semibold">{currentDayName}</span>
          </div>

          {classStatus.current ? (
            <div className="space-y-2">
              <h3 className="text-xl font-black">{classStatus.current.subject}</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-teal-100 font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-200" />
                  Faculty: <strong className="text-white">{classStatus.current.teacher}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-200" />
                  Room: <strong className="text-white">{classStatus.current.roomNo}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-200" />
                  Time: <strong className="text-white">{classStatus.current.time}</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-sm font-semibold text-teal-100">No active lecture at this moment.</p>
              <p className="text-xs text-teal-200/80 mt-0.5">Check your schedule below for upcoming slots.</p>
            </div>
          )}
        </div>

        {/* Next Class */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Up Next
            </span>
            <span className="text-xs text-slate-500 font-medium">3rd Sem B.Tech</span>
          </div>

          {classStatus.next ? (
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900">{classStatus.next.subject}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {classStatus.next.teacher}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Room {classStatus.next.roomNo}
                </span>
                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold rounded-md">
                  {classStatus.next.time}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-sm font-semibold text-slate-700">No remaining lectures today.</p>
              <p className="text-xs text-slate-400 mt-0.5">Enjoy your self-study and rest time!</p>
            </div>
          )}
        </div>
      </div>

      {/* Branch & Filter Selector Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        {/* Branch Pills */}
        <div>
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
            Select B.Tech Branch
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {BRANCHES.map(b => (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition whitespace-nowrap ${
                  selectedBranch === b
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Search Subject</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Subject (e.g. PYTHON)..."
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Teacher Code</label>
            <input
              type="text"
              placeholder="Code (e.g. SSM, MKS)..."
              value={filterTeacher}
              onChange={e => setFilterTeacher(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Filter Room</label>
            <select
              value={filterRoom}
              onChange={e => setFilterRoom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
            >
              <option value="">All Rooms</option>
              {ROOMS.map(r => (
                <option key={r} value={r}>Room {r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">Class Type</label>
            <select
              value={filterClassType}
              onChange={e => setFilterClassType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Types</option>
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab</option>
              <option value="Library">Library</option>
              <option value="Sports/Yoga">Sports/Yoga</option>
              <option value="Lunch Break">Lunch Break</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'day' ? (
        /* DAY SCHEDULE VIEW */
        <div className="space-y-4">
          {/* Day Pills */}
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
                {day} {day === currentDayName && '(Today)'}
              </button>
            ))}
          </div>

          {/* Cards for Day Schedule */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedBranch} — {selectedDay} Schedule
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  3rd Semester • Academic Year 2026-27 • Effective 20-07-2026
                </p>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                {dayTimetable.length} Slots
              </span>
            </div>

            {dayTimetable.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No classes scheduled for {selectedDay}.</p>
                <p className="text-xs text-slate-400 mt-1">Try selecting another day or clearing filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayTimetable.map((slot) => {
                  const isLunch = slot.classType === 'Lunch Break' || slot.subject === 'LUNCH BREAK';

                  if (isLunch) {
                    return (
                      <div
                        key={slot.id || slot._id}
                        className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                            <Coffee className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-orange-900 text-sm">LUNCH BREAK</h4>
                            <p className="text-xs text-orange-700 font-medium">Standard Campus Break Slot</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 bg-white border border-orange-200 rounded-xl text-xs font-extrabold text-orange-800 shadow-2xs">
                          12:00 PM - 01:00 PM
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={slot.id || slot._id}
                      className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-teal-300 hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex flex-col items-center justify-center font-black text-xs flex-shrink-0">
                          <span>{slot.code || 'SUB'}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 text-base">{slot.subject}</h4>
                            <span
                              className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${getClassBadgeStyle(
                                slot.classType
                              )}`}
                            >
                              {slot.classType}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2 font-medium">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              Faculty Code: <strong className="text-slate-900">{slot.teacher}</strong>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              Room: <strong className="text-slate-900">{slot.roomNo || slot.room}</strong>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              Semester: <strong className="text-slate-900">{slot.semester || '3rd Sem'}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-right">
                          <span className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-xs block">
                            {slot.time || `${slot.startTime} - ${slot.endTime}`}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                            {slot.effectiveFrom ? `Effective: ${slot.effectiveFrom}` : 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* WEEKLY MATRIX GRID VIEW */
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Master Weekly Timetable Matrix — {selectedBranch}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Days: Monday to Saturday • Course: B.Tech • 3rd Semester
              </p>
            </div>
            <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-extrabold rounded-xl">
              {branchTimetable.length} Total Slots
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[11px]">
                  <th className="p-3 border-r border-slate-200 min-w-[100px]">Day</th>
                  {TIME_SLOTS.map((slotTime) => (
                    <th key={slotTime} className="p-3 border-r border-slate-200 min-w-[140px] text-center">
                      {slotTime}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {DAYS.map((dayName) => {
                  const daySlots = branchTimetable.filter(t => t.day === dayName);

                  return (
                    <tr key={dayName} className="hover:bg-slate-50/70">
                      <td className="p-3 font-black text-slate-900 border-r border-slate-200 bg-slate-50/50">
                        {dayName}
                        {dayName === currentDayName && (
                          <span className="block text-[9px] text-teal-600 font-bold">TODAY</span>
                        )}
                      </td>

                      {TIME_SLOTS.map((slotTime) => {
                        if (slotTime === '12-1 PM') {
                          return (
                            <td
                              key={slotTime}
                              className="p-2 border-r border-slate-200 text-center bg-orange-50/60 font-bold text-orange-700 text-[11px]"
                            >
                              LUNCH BREAK
                            </td>
                          );
                        }

                        // Match slots for this time column
                        const matched = daySlots.find(s => s.time && s.time.includes(slotTime.split(' ')[0]));

                        return (
                          <td key={slotTime} className="p-2 border-r border-slate-200 text-center">
                            {matched ? (
                              <div
                                className={`p-2 rounded-xl border text-left space-y-1 ${getClassBadgeStyle(
                                  matched.classType
                                )}`}
                              >
                                <p className="font-black text-slate-900 text-[11px] leading-tight">
                                  {matched.subject}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold pt-0.5 border-t border-slate-200/40">
                                  <span>T: <strong>{matched.teacher}</strong></span>
                                  <span>R: <strong>{matched.roomNo}</strong></span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-300 font-medium">Free Slot</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
