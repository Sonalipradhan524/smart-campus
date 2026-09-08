import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Grid,
  DoorOpen,
  Sparkles,
  FileText,
  AlertTriangle,
  BarChart3,
  Megaphone
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { role } = useAuth();

  const studentNav = [
    { label: 'Home', path: '/student', icon: LayoutDashboard },
    { label: 'Services', path: '/student/services', icon: Grid },
    { label: 'Gate Pass', path: '/student/gate-pass', icon: DoorOpen },
    { label: 'CampusAI', path: '/student/assistant', icon: Sparkles, highlight: true },
    { label: 'Requests', path: '/student/requests', icon: FileText },
  ];

  const adminNav = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Requests', path: '/admin/requests', icon: FileText },
    { label: 'Complaints', path: '/admin/complaints', icon: AlertTriangle },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Notices', path: '/admin/notices', icon: Megaphone },
  ];

  const items = role === 'admin' ? adminNav : studentNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/student' || item.path === '/admin'}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl transition ${
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {item.highlight ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center -mt-3 shadow-md shadow-purple-500/30">
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <Icon className="w-5 h-5 mb-0.5" />
              )}
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
