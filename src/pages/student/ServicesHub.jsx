import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ServiceCard } from '../../components/common/ServiceCard';
import {
  Clock,
  Calendar,
  DoorOpen,
  Award,
  Home,
  Utensils,
  CreditCard,
  AlertTriangle,
  Megaphone,
  Sparkles,
  Search
} from 'lucide-react';

export const ServicesHub = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      title: 'Digital Gate Pass',
      description: 'Generate instant QR-verified outing permits for hostel exit and return validation.',
      icon: DoorOpen,
      link: '/student/gate-pass',
      badge: 'QR Active',
      statusText: 'Generate Pass',
    },
    {
      title: 'Leave Application',
      description: 'Apply for medical, academic, or personal leaves with instant HOD review tracking.',
      icon: Calendar,
      link: '/student/leave',
      statusText: 'Apply Leave',
    },
    {
      title: 'Certificate Request',
      description: 'Request official Bonafide, Conduct, Transfer, and Study certificates with digital seal.',
      icon: Award,
      link: '/student/certificates',
      statusText: 'Request Document',
    },
    {
      title: 'Smart Grievances',
      description: 'Log hostel, electrical, or plumbing complaints with automated AI routing.',
      icon: AlertTriangle,
      link: '/student/complaints',
      badge: 'AI Powered',
      statusText: 'Report Issue',
    },
    {
      title: 'Attendance Tracker',
      description: 'View real-time subject-wise presence, total classes attended, and threshold alerts.',
      icon: Clock,
      link: '/student/attendance',
      statusText: 'Check Percentage',
    },
    {
      title: 'Class Timetable',
      description: 'Interactive daily & weekly lecture schedule with room numbers and faculty details.',
      icon: Calendar,
      link: '/student/timetable',
      statusText: 'View Schedule',
    },
    {
      title: 'Hostel Hub',
      description: 'Room details, roommate directory, warden contact, rules, and block maintenance.',
      icon: Home,
      link: '/student/hostel',
      statusText: 'Manage Room',
    },
    {
      title: 'Mess Services',
      description: 'Check today’s meal menu, weekly diet plan, and submit instant food feedback.',
      icon: Utensils,
      link: '/student/mess',
      statusText: 'View Today\'s Menu',
    },
    {
      title: 'Fee Management',
      description: 'Check tuition & hostel fee breakdown, paid history, and instant online payments.',
      icon: CreditCard,
      link: '/student/fees',
      statusText: 'Pay & Receipts',
    },
    {
      title: 'Notice Center',
      description: 'Official announcements categorized by Exam, Academic, Hostel, and Emergency.',
      icon: Megaphone,
      link: '/student/notices',
      statusText: 'Read Announcements',
    },
  ];

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Campus Service Hub"
        subtitle="Access all 10 unified campus services from a single digital interface."
        badge="CampusOS Services"
      >
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
          />
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </div>
  );
};
