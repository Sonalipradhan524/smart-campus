import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Search, UserCheck } from 'lucide-react';

export const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getStudents();
      setStudents(data || []);
    } catch (e) {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.roll || '').includes(search) ||
      (s.dept || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Student Directory Governance"
        subtitle="Search student records, attendance eligibility, and hostel room assignments."
        badge={`${students.length} Enrolled Students`}
      >
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, roll no..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
          />
        </div>
      </PageHeader>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
            <tr>
              <th className="p-3">Student ID</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Roll Number</th>
              <th className="p-3">Department</th>
              <th className="p-3">Semester</th>
              <th className="p-3">Hostel Allocation</th>
              <th className="p-3">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">Loading student directory...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No registered student records found in database.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id || s.roll} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{s.id ? String(s.id).slice(-8) : s.roll}</td>
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {s.name ? s.name[0] : 'S'}
                    </div>
                    {s.name}
                  </td>
                  <td className="p-3 font-mono text-slate-600">{s.roll}</td>
                  <td className="p-3 text-slate-700">{s.dept}</td>
                  <td className="p-3 text-slate-600">{s.sem}</td>
                  <td className="p-3 text-slate-600">{s.hostel}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 font-bold rounded-md bg-emerald-100 text-emerald-800">
                      {s.attendance}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
