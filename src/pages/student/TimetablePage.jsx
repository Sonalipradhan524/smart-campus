import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Calendar, MapPin, User, Clock, Filter } from 'lucide-react';

export const TimetablePage = () => {
  const { timetable } = useData();

  const [selectedDay, setSelectedDay] = useState('Tuesday');
  const [viewMode, setViewMode] = useState('day'); // 'day' vs 'week'

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredTimetable = timetable.filter((t) => t.day === selectedDay);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Academic Timetable & Class Schedule"
        subtitle="View lecture halls, practical lab slots, and faculty schedule."
        badge="6th Sem CSE"
      >
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'day' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'week' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Weekly Schedule
          </button>
        </div>
      </PageHeader>

      {/* Day Selector Pills */}
      {viewMode === 'day' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Timetable List (Day View) */}
      {viewMode === 'day' ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
            <span>Schedule for {selectedDay}</span>
            <span className="text-xs text-slate-500 font-normal">{filteredTimetable.length} Slots Scheduled</span>
          </h3>

          <div className="space-y-3">
            {filteredTimetable.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No classes scheduled for this day.</p>
            ) : (
              filteredTimetable.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-blue-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs flex-shrink-0">
                      {slot.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{slot.subject}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {slot.faculty}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {slot.room}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                      {slot.time}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-blue-50 text-blue-700">
                      {slot.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Weekly Grid View */
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3">Day</th>
                <th className="p-3">09:00 - 10:00 AM</th>
                <th className="p-3">10:15 - 11:15 AM</th>
                <th className="p-3">11:30 - 01:00 PM</th>
                <th className="p-3">02:00 - 03:30 PM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {days.map((day) => {
                const slots = timetable.filter((t) => t.day === day);
                return (
                  <tr key={day} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{day}</td>
                    {[0, 1, 2, 3].map((idx) => {
                      const slot = slots[idx];
                      return (
                        <td key={idx} className="p-3">
                          {slot ? (
                            <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                              <p className="font-bold text-slate-900 text-[11px]">{slot.subject}</p>
                              <p className="text-[10px] text-blue-700 font-medium">{slot.room}</p>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-300">Free Slot</span>
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
      )}
    </div>
  );
};
