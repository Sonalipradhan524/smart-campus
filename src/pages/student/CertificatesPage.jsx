import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Award, FileText, Send, Download, CheckCircle2 } from 'lucide-react';

export const CertificatesPage = () => {
  const { requests, addCertificateRequest } = useData();

  const certTypes = [
    'Bonafide Certificate',
    'Character & Conduct Certificate',
    'Study & Academic Record Certificate',
    'Transfer / Migration Certificate',
    'Fee Structure Certificate',
  ];

  const [selectedCert, setSelectedCert] = useState(certTypes[0]);
  const [purpose, setPurpose] = useState('');
  const [copies, setCopies] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('Digital PDF Download');

  const certRequests = requests.filter((r) => r.type === 'Certificate');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!purpose.trim()) return;
    addCertificateRequest({
      certType: selectedCert,
      purpose,
      copies,
      deliveryMethod,
    });
    setPurpose('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Official Certificate Requests"
        subtitle="Request university-sealed documents for education loans, internships, or higher studies."
        badge="Academic Registry"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Apply for Certificate
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Certificate Type
              </label>
              <select
                value={selectedCert}
                onChange={(e) => setSelectedCert(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
              >
                {certTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Purpose of Certificate
              </label>
              <textarea
                rows={3}
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="State the reason (e.g. Bank Loan Renewal, TCS Verification, Passport Application)..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Copies Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={copies}
                  onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Delivery Mode
                </label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-blue-500"
                >
                  <option value="Digital PDF Download">Digital PDF</option>
                  <option value="Physical Pickup">Physical Pickup</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Request
            </button>
          </form>
        </div>

        {/* Certificate Tracking List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-4">Tracking Requested Certificates</h3>

            <div className="space-y-3">
              {certRequests.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No certificate requests lodged yet.
                </div>
              ) : (
                certRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-slate-400">{req.id}</span>
                          <StatusBadge status={req.status} />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{req.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Purpose: {req.details?.purpose}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      {req.status === 'Completed' ? (
                        <button
                          onClick={() => alert(`Downloading verified PDF for ${req.id}`)}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Verified PDF
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Processing Seal</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
