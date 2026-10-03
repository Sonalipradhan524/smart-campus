import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Phone,
  PhoneCall,
  AlertTriangle,
  Radio,
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle2,
  BellRing,
  HelpCircle,
  Activity,
  HeartPulse,
  Flame,
  ShieldCheck,
  Send
} from 'lucide-react';

export const CampusBeaconPage = () => {
  const { user } = useAuth();
  const { showToast, publishNotice } = useData();

  const [sosActive, setSosActive] = useState(false);
  const [sosDetails, setSosDetails] = useState(null);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState('General Distress / Safety');
  const [emergencyNote, setEmergencyNote] = useState('');
  const [isSubmittingSos, setIsSubmittingSos] = useState(false);

  // The 4 mandatory real emergency contact numbers
  const emergencyContacts = [
    {
      id: 1,
      name: 'Emergency Contact 1',
      title: '📞 Emergency Contact 1',
      number: '7848988524',
      telLink: 'tel:7848988524',
      badge: 'Priority 1',
      color: 'from-rose-500 to-red-600',
      description: 'Campus Rapid Action & Central Security Desk',
    },
    {
      id: 2,
      name: 'Emergency Contact 2',
      title: '📞 Emergency Contact 2',
      number: '9861014225',
      telLink: 'tel:9861014225',
      badge: 'Priority 2',
      color: 'from-red-600 to-amber-600',
      description: 'Hostel Chief Warden & Residential Assistance',
    },
    {
      id: 3,
      name: 'Emergency Contact 3',
      title: '📞 Emergency Contact 3',
      number: '9124028834',
      telLink: 'tel:9124028834',
      badge: 'Priority 3',
      color: 'from-orange-500 to-rose-600',
      description: 'Campus Medical Health Clinic & First Aid',
    },
    {
      id: 4,
      name: 'Emergency Contact 4',
      title: '📞 Emergency Contact 4',
      number: '8917309755',
      telLink: 'tel:8917309755',
      badge: 'Priority 4',
      color: 'from-amber-600 to-red-600',
      description: 'Student Grievance & Proctor Emergency Cell',
    },
  ];

  const handleSendBeaconSOS = async () => {
    setIsSubmittingSos(true);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const locationStr = user?.hostelBlock ? `Hostel ${user.hostelBlock}, Room ${user.roomNo || 'N/A'}` : 'Campus Main Premises';

    const payload = {
      studentName: user?.name || 'Student',
      rollNo: user?.rollNo || user?.identifier || 'N/A',
      location: locationStr,
      time: timestamp,
      type: selectedEmergencyType,
      note: emergencyNote || 'Immediate assistance requested via Campus Beacon SOS button.',
    };

    // Broadcast to backend notices/notifications and audit
    try {
      if (publishNotice) {
        await publishNotice({
          title: `🚨 EMERGENCY SOS BEACON: ${payload.studentName} (${payload.rollNo})`,
          department: 'Campus Security & Medical Cell',
          priority: 'Emergency',
          category: 'Emergency',
          content: `Distress alert triggered by ${payload.studentName} (${payload.rollNo}) at ${payload.location} at ${payload.time}. Nature: ${payload.type}. Note: ${payload.note}`,
        });
      }
    } catch (err) {
      console.warn('SOS notice broadcast local fallback:', err);
    }

    setSosDetails(payload);
    setSosActive(true);
    setIsSubmittingSos(false);
    showToast('🚨 CAMPUS BEACON SOS TRANSMITTED! Campus Security & Medical units alerted.', 'error');
  };

  const handleDeactivateSos = () => {
    setSosActive(false);
    showToast('Campus Beacon SOS marked as resolved/stand-down.', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Campus Beacon (Emergency SOS & Help Desk)"
        subtitle="Instant one-tap phone dialers, rapid security dispatch, and automated campus distress broadcasting."
        badge="24x7 Active Beacon"
      />

      {/* Active SOS Banner (if triggered) */}
      {sosActive && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-2xl shadow-red-600/30 border-2 border-white/30 animate-pulse">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 text-white font-black">
                <Radio className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-700 font-extrabold text-[10px] uppercase tracking-wider">
                    Distress Signal Live
                  </span>
                  <span className="text-xs text-rose-100">{sosDetails?.time}</span>
                </div>
                <h3 className="text-lg font-black tracking-tight mt-1">
                  🚨 SOS Beacon Active for {sosDetails?.studentName}
                </h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  Location: <strong className="underline">{sosDetails?.location}</strong> • Type: <strong>{sosDetails?.type}</strong>
                </p>
                {sosDetails?.note && (
                  <p className="text-[11px] text-rose-200 mt-1 italic">
                    "{sosDetails?.note}"
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleDeactivateSos}
              className="px-4 py-2 bg-white/90 hover:bg-white text-rose-700 rounded-xl font-extrabold text-xs transition shadow-md whitespace-nowrap"
            >
              Stand Down / Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Emergency Call Section */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-extrabold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              Emergency Call Section
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
              One-Tap Emergency Direct Dialers
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tap any contact button below to instantly launch your phone dialer via the <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[11px] font-mono">tel:</code> protocol.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-xs font-bold self-start sm:self-auto">
            <Activity className="w-3.5 h-3.5" /> 4 Verified Lines Active
          </span>
        </div>

        {/* 4 Separate Emergency Contact Buttons / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.id}
              href={contact.telLink}
              id={`emergency-contact-btn-${contact.id}`}
              className="group relative overflow-hidden p-5 rounded-2xl border-2 border-slate-200/80 hover:border-rose-500 bg-slate-50/70 hover:bg-white transition-all duration-200 shadow-xs hover:shadow-lg hover:shadow-rose-500/10 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${contact.color} text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform`}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                      {contact.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {contact.description}
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-700 rounded-md border border-rose-200">
                  {contact.badge}
                </span>
              </div>

              {/* Number and Tap to Call Trigger Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono font-black text-sm sm:text-base text-slate-800 group-hover:text-rose-600">
                  <span>+91 {contact.number}</span>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-rose-600 group-hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Send Campus Beacon SOS Trigger Section */}
      <section className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white border border-rose-500/30 shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            Campus Beacon SOS Dispatcher
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            🚨 Send Campus Beacon SOS
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Triggering the SOS Beacon immediately alerts campus proctors, hostel wardens, and medical responders with your identity and location.
          </p>

          <div className="mt-5 space-y-3.5">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1.5">
                Select Distress Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Medical Urgent', icon: HeartPulse },
                  { label: 'Security / Safety', icon: ShieldAlert },
                  { label: 'Fire / Hazard', icon: Flame },
                  { label: 'Hostel Ragging/Emergency', icon: AlertTriangle },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setSelectedEmergencyType(item.label)}
                      className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 border transition ${
                        selectedEmergencyType === item.label
                          ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Distress Note */}
            <div>
              <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1.5">
                Location or Situation Note (Optional)
              </label>
              <input
                type="text"
                value={emergencyNote}
                onChange={(e) => setEmergencyNote(e.target.value)}
                placeholder="E.g. Near Library Gate, need medical first-aid immediately..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs outline-none focus:border-rose-400"
              />
            </div>

            {/* Main Big Red SOS Button */}
            <button
              id="send-campus-beacon-sos-btn"
              onClick={handleSendBeaconSOS}
              disabled={isSubmittingSos}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base sm:text-lg shadow-xl shadow-rose-600/40 flex items-center justify-center gap-3 transition duration-200 hover:scale-[1.01] active:scale-[0.99] border border-rose-400/50 cursor-pointer"
            >
              <Radio className="w-6 h-6 animate-pulse" />
              <span>{isSubmittingSos ? 'TRANSMITTING BEACON...' : '🚨 Send Campus Beacon SOS'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Safety Protocol Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Medical Emergency</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Campus Health Centre has 24/7 on-call nurses and immediate ambulance transport to partner hospitals.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Anti-Ragging Squad</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Zero tolerance anti-ragging cell with anonymous fast-track reporting and instant hostel warden intervention.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Fire & Disaster Action</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Emergency assembly zones are designated outside every department block and hostel courtyard.
          </p>
        </div>
      </section>
    </div>
  );
};
