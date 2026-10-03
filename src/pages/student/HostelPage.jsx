import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Home, Users, UserCheck, Phone, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

export const HostelPage = () => {
  const { user } = useAuth();
  const { hostel = {}, complaints = [] } = useData();

  const safeHostel = {
    roomNo: hostel?.roomNo || user?.roomNo || 'B-204',
    block: hostel?.block || hostel?.name || 'Kalpana Chawla Hall (Block B)',
    floor: hostel?.floor || '2nd Floor',
    wardenName: hostel?.wardenName || hostel?.warden || 'Dr. S. K. Nayak (+91 94371 88900)',
    wardenPhone: hostel?.wardenPhone || '+91 94371 88900',
    caretakerName: hostel?.caretakerName || hostel?.caretaker || 'Mr. Rajesh Kumar (+91 98612 33445)',
    caretakerPhone: hostel?.caretakerPhone || '+91 98612 33445',
    roommates: Array.isArray(hostel?.roommates) && hostel.roommates.length > 0 ? hostel.roommates : [
      { name: 'Amitav Das', roll: '2201105045', dept: 'CSE' },
      { name: 'Saurav Mohanty', roll: '2201105049', dept: 'ECE' },
    ],
    rules: Array.isArray(hostel?.rules) && hostel.rules.length > 0 ? hostel.rules : [
      'Gate closes strictly at 9:30 PM',
      'No high-wattage electrical appliances allowed in rooms',
      'Visitors permitted only in guest lounge during daytime'
    ],
  };

  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  const hostelComplaints = safeComplaints.filter((c) => (c.location || '').toLowerCase().includes('hostel'));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Hostel & Residence Hub"
        subtitle="Manage room occupancy, warden contacts, rules, and block maintenance."
        badge={safeHostel.roomNo}
      />

      {/* Main Hostel Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room & Block Details */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-900 to-indigo-900 text-white shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
            <Home className="w-5 h-5 text-teal-300" />
          </div>
          <p className="text-xs text-teal-200 uppercase font-bold tracking-wider">Assigned Room</p>
          <h2 className="text-3xl font-black text-white mt-1">{safeHostel.roomNo}</h2>
          <p className="text-xs text-teal-100 mt-1">{safeHostel.block}</p>
          <p className="text-[11px] text-teal-300/80 mt-2">{safeHostel.floor}</p>
        </div>

        {/* Warden Contact Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Hostel Warden</h4>
                <p className="text-xs text-slate-500">{safeHostel.wardenName}</p>
              </div>
            </div>
            <a
              href={`tel:${safeHostel.wardenPhone}`}
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-xs font-bold text-slate-700 transition"
            >
              <Phone className="w-4 h-4 text-purple-600" /> {safeHostel.wardenPhone}
            </a>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Caretaker:</span>{' '}
            <span className="font-bold text-slate-700">{safeHostel.caretakerName} ({safeHostel.caretakerPhone})</span>
          </div>
        </div>

        {/* Roommates Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Roommates Directory</h4>
          </div>

          <div className="space-y-2 text-xs">
            {safeHostel.roommates.map((rm, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{rm.name}</p>
                  <p className="text-[10px] text-slate-400">Roll: {rm.roll}</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-white text-slate-600 rounded-md border border-slate-200">
                  {rm.dept}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Hostel Complaints & Hostel Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Hostel Maintenance Complaints */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-base">Hostel Grievances Status</h3>
            <Link to="/student/complaints" className="text-xs font-bold text-teal-600 hover:text-teal-800">
              + Report Issue
            </Link>
          </div>

          <div className="space-y-3">
            {hostelComplaints.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No open hostel maintenance issues.</p>
            ) : (
              hostelComplaints.map((c) => (
                <div key={c.id || c._id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{c.id || c._id}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{c.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.assignedTo}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hostel Rules & Discipline Code */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Hostel Rules & Regulations
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {safeHostel.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/60 border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
