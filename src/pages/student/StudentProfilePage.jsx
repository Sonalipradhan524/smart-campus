import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { User, GraduationCap, Home, Phone, Mail, MapPin, Award, ShieldCheck, Edit, Check } from 'lucide-react';

export const StudentProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [guardianPhone, setGuardianPhone] = useState(user?.guardianPhone || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [address, setAddress] = useState(user?.address || '');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      name,
      phone,
      guardianPhone,
      bloodGroup,
      address,
    });
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Student Profile & Digital Identity"
        subtitle="Official academic record, hostel allocation, and emergency contacts."
        badge={user?.rollNo || 'Student Profile'}
      >
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
        >
          <Edit className="w-4 h-4" /> Edit Profile Details
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Digital Student ID Card */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white">
                  C
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white tracking-tight">CAMPUSOS DIGITAL ID</h3>
                  <p className="text-[10px] text-blue-300">BPUT Autonomous Campus</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                VERIFIED
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/30 shadow-md"
              />
              <div>
                <h3 className="font-black text-lg text-white">{user?.name}</h3>
                <p className="text-xs text-blue-200 font-mono mt-0.5">{user?.rollNo}</p>
                <p className="text-xs text-slate-400 mt-1">{user?.department}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-700/80 pt-3">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 font-medium">Batch:</span>
                <span className="font-bold text-white">{user?.batch || '2022 - 2026'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 font-medium">Hostel:</span>
                <span className="font-bold text-white">{user?.hostel || 'Kalpana Chawla'} ({user?.roomNo || 'B-204'})</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 font-medium">CGPA:</span>
                <span className="font-bold text-emerald-400">{user?.cgpa || '8.92'} / 10.0</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/80 text-center">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">PERSISTENT MONGODB PROFILE</p>
          </div>
        </div>

        {/* Right Column: Academic & Personal Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block">Full Name</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.name}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block">Email ID</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.email}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block">Phone Number</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.phone || 'Not set'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block">Guardian Emergency Contact</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.guardianPhone || 'Not set'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block">Blood Group</span>
                <span className="font-bold text-rose-600 text-sm mt-0.5 block">{user?.bloodGroup || 'O+'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block">Home Address</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.address || 'Bhubaneswar, Odisha'}</span>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" /> Academic Record
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-indigo-600 font-bold block">Current Semester</span>
                <span className="font-extrabold text-slate-900 text-base mt-1 block">{user?.semester || '6th Semester'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="text-blue-600 font-bold block">Cumulative CGPA</span>
                <span className="font-extrabold text-slate-900 text-base mt-1 block">{user?.cgpa || '8.92'} / 10.0</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-emerald-600 font-bold block">Discipline Record</span>
                <span className="font-extrabold text-emerald-800 text-base mt-1 block">Clean (Zero Offense)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Personal Information"
      >
        <form onSubmit={handleProfileSave} className="space-y-3.5 text-xs text-slate-800">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">Guardian Phone</label>
            <input
              type="text"
              value={guardianPhone}
              onChange={(e) => setGuardianPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">Blood Group</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">City / Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save to MongoDB
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
