import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Calendar, Plus, MapPin, Users } from 'lucide-react';

export const AdminTimetablePage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Class Timetable & Room Allocation"
        subtitle="Manage lecture slots, laboratory assignments, and faculty load schedules."
        badge="Master Schedule"
      >
        <button
          onClick={() => alert('Opening Class Slot Allocator modal...')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> Add Lecture Slot
        </button>
      </PageHeader>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900 mb-4">Master Campus Room Utilization</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 text-sm block">Lecture Hall LH-201</span>
            <span className="text-xs text-slate-500 block mt-0.5 font-medium">Occupied: 09:00 AM - 01:00 PM (Compiler & Cloud)</span>
            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">80% Capacity</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 text-sm block">Computer Science Lab 3</span>
            <span className="text-xs text-slate-500 block mt-0.5 font-medium">Occupied: 11:30 AM - 01:00 PM (Web Tech)</span>
            <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">100% Capacity</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 text-sm block">AI & Data Science Lab 1</span>
            <span className="text-xs text-slate-500 block mt-0.5 font-medium">Occupied: 11:30 AM - 01:00 PM (AI Lab)</span>
            <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md">95% Capacity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
