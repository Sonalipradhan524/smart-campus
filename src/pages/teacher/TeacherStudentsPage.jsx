import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Users, Search, Filter, Mail, Phone, GraduationCap, CheckCircle } from 'lucide-react';

const mockStudents = [
  { rollNo: '2201105001', name: 'Aarav Sharma', dept: 'CSE', sem: '6th Sem', attendance: '92%', status: 'Active' },
  { rollNo: '2201105002', name: 'Ananya Pattnaik', dept: 'CSE', sem: '6th Sem', attendance: '96%', status: 'Active' },
  { rollNo: '2201105003', name: 'Ayush Mohanty', dept: 'CSE', sem: '6th Sem', attendance: '88%', status: 'Active' },
  { rollNo: '2201105004', name: 'Biswajit Behera', dept: 'CSE', sem: '6th Sem', attendance: '72%', status: 'Warning' },
  { rollNo: '2201105005', name: 'Debashish Sahoo', dept: 'CSE', sem: '6th Sem', attendance: '94%', status: 'Active' },
  { rollNo: '2201105006', name: 'Isha Priyadarshini', dept: 'CSE', sem: '6th Sem', attendance: '98%', status: 'Active' },
  { rollNo: '2201105007', name: 'Manish Kumar Ratha', dept: 'CSE', sem: '6th Sem', attendance: '84%', status: 'Active' },
  { rollNo: '2201105008', name: 'Pooja Parida', dept: 'CSE', sem: '6th Sem', attendance: '68%', status: 'Warning' },
  { rollNo: '2201105009', name: 'Priya Das', dept: 'CSE', sem: '6th Sem', attendance: '90%', status: 'Active' },
  { rollNo: '2201105010', name: 'Rahul Sharma', dept: 'CSE', sem: '6th Sem', attendance: '88%', status: 'Active' },
];

export const TeacherStudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = mockStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Assigned Students Directory"
        subtitle="View student academic roster, attendance performance, and contact info"
        icon={Users}
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name or roll number..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs outline-none focus:border-indigo-500 transition"
          />
        </div>
        <span className="text-xs text-slate-500 font-bold px-3">
          {filteredStudents.length} Students Listed
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5">Department & Semester</th>
                <th className="px-6 py-3.5">Attendance Rate</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map((student) => (
                <tr key={student.rollNo} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">{student.rollNo}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4 text-slate-600">{student.dept} • {student.sem}</td>
                  <td className="px-6 py-4 font-bold text-indigo-700">{student.attendance}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
