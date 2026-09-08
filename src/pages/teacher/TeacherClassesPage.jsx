import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { BookOpen, Users, Calendar, MapPin, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherClassesPage = () => {
  const { user } = useAuth();

  const assignedClasses = user.assignedClasses || [
    { subject: 'Data Structures & Algorithms', code: 'CSE-301', semester: '6th Semester', section: 'Section A', enrolledCount: 45, room: 'Academic Block 2 - Hall 301', time: 'Mon, Wed, Fri (10:00 AM)' },
    { subject: 'Database Management Systems', code: 'CSE-304', semester: '4th Semester', section: 'Section B', enrolledCount: 42, room: 'Lab Block 1 - Lab 204', time: 'Tue, Thu (02:00 PM)' },
    { subject: 'Artificial Intelligence & ML', code: 'CSE-402', semester: '8th Semester', section: 'Section A', enrolledCount: 38, room: 'Seminar Hall B', time: 'Mon, Thu (11:30 AM)' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Assigned Classes"
        subtitle="Manage active course sections, enrolled student rosters, and schedules"
        icon={BookOpen}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assignedClasses.map((cls) => (
          <div key={cls.code} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-full border border-indigo-200">
                {cls.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">{cls.section}</span>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{cls.subject}</h3>
              <p className="text-xs text-slate-500 mt-1">{cls.semester}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span><strong className="text-slate-900">{cls.enrolledCount}</strong> Enrolled Students</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{cls.room || 'Academic Block 2'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{cls.time || 'Mon, Wed, Fri'}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/teacher/attendance?class=${cls.code}`}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Take Attendance</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
