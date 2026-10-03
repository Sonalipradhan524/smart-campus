import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { BellRing, Check, CheckCheck, Filter } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, markAllNotificationsRead, markNotificationRead } = useData();
  const [filterType, setFilterType] = useState('All');

  const types = ['All', 'Request', 'Complaint', 'Academic', 'Hostel', 'Fees'];

  const filtered = notifications.filter((n) => filterType === 'All' || n.type === filterType);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Campus Notification Center"
        subtitle="Real-time alerts for gate pass approvals, grievance updates, and emergency alerts."
        badge={`${notifications.filter((n) => !n.read).length} Unread`}
      >
        <button
          onClick={markAllNotificationsRead}
          className="px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <CheckCheck className="w-4 h-4" /> Mark All as Read
        </button>
      </PageHeader>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 bg-white p-3 rounded-2xl border border-slate-200/90">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterType === type ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 text-slate-400 text-xs">
            No notifications available in this category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                item.read ? 'bg-white border-slate-200/80' : 'bg-teal-50/50 border-teal-200 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  item.read ? 'bg-slate-100 text-slate-500' : 'bg-teal-600 text-white'
                }`}>
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                </div>
              </div>

              {!item.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 flex-shrink-0 mt-2" title="Unread" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
