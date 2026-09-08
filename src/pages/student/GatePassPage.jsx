import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { CSSQRCode } from '../../components/common/CSSQRCode';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DoorOpen, Clock, MapPin, Send, ShieldCheck, UserCheck, Calendar } from 'lucide-react';

export const GatePassPage = () => {
  const { user } = useAuth();
  const { requests, addGatePassRequest } = useData();

  // Find active gate pass if any
  const activePass = requests.find((r) => r.type === 'Gate Pass' && r.status === 'Approved');

  const [date, setDate] = useState('2026-09-09');
  const [exitTime, setExitTime] = useState('04:00 PM');
  const [returnTime, setReturnTime] = useState('08:30 PM');
  const [destination, setDestination] = useState('Forum Mart, Janpath, Bhubaneswar');
  const [reason, setReason] = useState('Buying essential books and hostel supplies');
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 00112');

  const handleGeneratePass = (e) => {
    e.preventDefault();
    addGatePassRequest({
      date,
      exitTime,
      returnTime,
      destination,
      reason,
      emergencyContact,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Digital Outing & Gate Pass"
        subtitle="Generate instant verified QR outing permits for security gate verification."
        badge="Security Protocol"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Gate Pass Request Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-blue-600" /> Apply for Gate Outing Pass
          </h3>

          <form onSubmit={handleGeneratePass} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Outing Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Exit Time
                </label>
                <input
                  type="text"
                  required
                  value={exitTime}
                  onChange={(e) => setExitTime(e.target.value)}
                  placeholder="04:00 PM"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Expected Return
                </label>
                <input
                  type="text"
                  required
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  placeholder="08:30 PM"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Destination
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Market / Station / Home"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Reason
              </label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Emergency Guardian Contact
              </label>
              <input
                type="tel"
                required
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Issue Digital Pass Instant QR
            </button>
          </form>
        </div>

        {/* Right Side: Active Digital Pass Card */}
        <div>
          {activePass ? (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm">
                    C
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight text-white">DIGITAL GATE PASS</h3>
                    <p className="text-[10px] text-blue-300 uppercase">CampusOS Verified</p>
                  </div>
                </div>
                <StatusBadge status="Approved" />
              </div>

              {/* QR Code and Key Details */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <CSSQRCode passId={activePass.id} />

                <div className="flex-1 space-y-2 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Student Name</p>
                    <p className="font-bold text-sm text-white">{user?.name || 'Rahul Sharma'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Student ID / Roll No</p>
                    <p className="font-mono text-blue-300 font-bold">{user?._id || user?.id || '2201105042'} ({user?.rollNo || '2201105042'})</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Hostel & Room</p>
                    <p className="font-semibold text-slate-200">{user?.hostel || 'Hostel B'} - {user?.roomNo || 'B-204'}</p>
                  </div>
                </div>
              </div>

              {/* Timing Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-400" /> Allowed Exit
                  </p>
                  <p className="font-bold text-slate-100 mt-0.5">{activePass.details.exitTime}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> Return Deadline
                  </p>
                  <p className="font-bold text-slate-100 mt-0.5">{activePass.details.returnTime}</p>
                </div>
              </div>

              {/* Destination & Authorized By */}
              <div className="space-y-1.5 text-xs border-t border-slate-700/80 pt-3">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400"><MapPin className="w-3.5 h-3.5 text-rose-400" /> Destination:</span>
                  <span className="font-bold text-white">{activePass.details.destination}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized By:</span>
                  <span className="font-bold text-emerald-300">{activePass.details.approvedBy}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 py-16">
              <DoorOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700">No Active Gate Pass</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Fill out the outing permit form on the left to issue your QR-verified digital gate pass.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
