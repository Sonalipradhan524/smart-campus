import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';

const scheduleData = [
  { day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Data Structures & Algorithms', code: 'CSE-301', room: 'Hall 301', sec: 'Sec A' },
  { day: 'Monday', time: '11:30 AM - 12:30 PM', subject: 'Artificial Intelligence & ML', code: 'CSE-402', room: 'Seminar Hall B', sec: 'Sec A' },
  { day: 'Tuesday', time: '02:00 PM - 03:00 PM', subject: 'Database Management Systems', code: 'CSE-304', room: 'Lab 204', sec: 'Sec B' },
  { day: 'Wednesday', time: '10:00 AM - 11:00 AM', subject: 'Data Structures & Algorithms', code: 'CSE-301', room: 'Hall 301', sec: 'Sec A' },
  { day: 'Thursday', time: '11:30 AM - 12:30 PM', subject: 'Artificial Intelligence & ML', code: 'CSE-402', room: 'Seminar Hall B', sec: 'Sec A' },
  { day: 'Thursday', time: '02:00 PM - 03:00 PM', subject: 'Database Management Systems', code: 'CSE-304', room: 'Lab 204', sec: 'Sec B' },
  { day: 'Friday', time: '10:00 AM - 11:00 AM', subject: 'Data Structures & Algorithms', code: 'CSE-301', room: 'Hall 301', sec: 'Sec A' },
];

export const TeacherTimetablePage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Faculty Weekly Schedule"
        subtitle="View your assigned teaching slots, venues, and lecture times"
        icon={Calendar}
      />

      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">Weekly Lecture Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduleData.map((slot, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex flex-col items-center justify-center font-extrabold text-xs flex-shrink-0">
                <span>{slot.day.slice(0, 3)}</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{slot.subject}</h4>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] rounded-md">{slot.code}</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {slot.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {slot.room} ({slot.sec})</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
