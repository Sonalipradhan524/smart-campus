import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { CreditCard, DollarSign, Send, CheckCircle2 } from 'lucide-react';

export const AdminFeesPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Campus Fee & Accounts Governance"
        subtitle="Track total semester fee collection, outstanding balances, and send automated payment reminders."
        badge="Accounts Desk"
      >
        <button
          onClick={() => alert('Broadcast fee payment reminders sent to 412 students with pending dues!')}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
        >
          <Send className="w-4 h-4" /> Send Fee Reminders
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Expected Fees"
          value="₹29.07 Cr"
          subtitle="Even Semester 2026"
          icon={CreditCard}
          color="teal"
        />
        <StatCard
          title="Collected Revenue"
          value="₹24.11 Cr"
          subtitle="83% Collections Completed"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Outstanding Dues"
          value="₹4.96 Cr"
          subtitle="412 Students Pending Dues"
          icon={CreditCard}
          color="amber"
        />
      </div>
    </div>
  );
};
