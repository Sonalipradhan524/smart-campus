import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { VoiceInputButton } from '../../components/common/VoiceInputButton';
import { Calendar, Paperclip, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const LeaveApplyPage = () => {
  const { addLeaveRequest } = useData();
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState('Medical');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-17');
  const [reason, setReason] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 00112');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!reason.trim() || reason.length < 10) {
      err.reason = 'Please provide a detailed reason (at least 10 characters).';
    }
    if (!emergencyContact.trim() || emergencyContact.length < 10) {
      err.emergencyContact = 'Please enter a valid 10-digit emergency contact number.';
    }
    if (new Date(endDate) < new Date(startDate)) {
      err.endDate = 'End date cannot be earlier than start date.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const reqId = addLeaveRequest({
      leaveType,
      startDate,
      endDate,
      reason,
      emergencyContact,
      attachment: file,
    });

    navigate('/student/requests');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Apply for Student Leave"
        subtitle="Submit official leave applications directly to your Head of Department and Warden."
        badge="Official Permit"
      />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Leave Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Leave Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Medical', 'Academic / Event', 'Personal / Family'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLeaveType(type)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition text-center ${
                    leaveType === type
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                End Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-teal-500"
                />
              </div>
              {errors.endDate && <p className="text-[11px] text-rose-600 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Reason for Absence <span className="text-rose-500">*</span>
              </label>
              <VoiceInputButton
                currentValue={reason}
                onTranscript={(text) => setReason(text)}
                mode="append"
              />
            </div>
            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the detailed reason for leave (e.g. medical illness, family emergency). Dictate with voice if preferred..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:bg-white focus:border-teal-500 transition"
            />
            {errors.reason && <p className="text-[11px] text-rose-600 mt-1">{errors.reason}</p>}
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Parent / Guardian Emergency Contact <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+91 98765 00000"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
            />
            {errors.emergencyContact && <p className="text-[11px] text-rose-600 mt-1">{errors.emergencyContact}</p>}
          </div>

          {/* Document Attachment */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Upload Supporting Document (Optional for Medical / Event)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 bg-slate-50/50 p-4 rounded-2xl text-center cursor-pointer transition">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                <Paperclip className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600">
                  {file ? file.name : 'Click to attach prescription / invitation letter (PDF or JPG)'}
                </span>
                <span className="text-[10px] text-slate-400">Max file size: 5 MB</span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-500/20 hover:bg-teal-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Leave Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
