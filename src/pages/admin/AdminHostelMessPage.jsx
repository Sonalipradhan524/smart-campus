import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Home, Utensils, Users, Star, AlertTriangle } from 'lucide-react';

export const AdminHostelMessPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Hostel Occupancy & Mess Governance"
        subtitle="Block capacity oversight, mess vendor ratings, and dining cleanliness audit."
        badge="Hostel Admin"
      />

      {/* Block Occupancy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Hostel Block A (Boys)</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">780 / 800 Occupied</h3>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full w-[97.5%]" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">20 Beds Vacant</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Hostel Block B (Girls)</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">650 / 650 Occupied</h3>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full w-[100%]" />
          </div>
          <span className="text-[10px] text-purple-600 font-bold mt-1 block">Fully Occupied</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Hostel Block C (Boys)</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">750 / 800 Occupied</h3>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full w-[93.7%]" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">50 Beds Vacant</span>
        </div>
      </div>

      {/* Mess Catering Performance */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-blue-600" /> Mess Vendor Ratings & Student Feedback Summary
          </h3>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.6 / 5.0 Avg Rating
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
          <p className="font-bold text-slate-900">Current Caterer: Annapurna Campus Hospitality Pvt Ltd</p>
          <p className="text-slate-600">Contract Validity: July 2026 - June 2027 • Daily Meal Servings: ~6,500 Meals</p>
          <p className="text-emerald-700 font-semibold">Hygiene Audit Score: 94/100 (Inspected by Dean Welfare on 02 Sep)</p>
        </div>
      </div>
    </div>
  );
};
