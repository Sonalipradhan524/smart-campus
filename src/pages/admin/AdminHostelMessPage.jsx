import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { VoiceInputButton } from '../../components/common/VoiceInputButton';
import {
  Home,
  Utensils,
  Users,
  Star,
  Trash2,
  PlusCircle,
  TrendingDown,
  Scale,
  Calendar,
  Layers,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const AdminHostelMessPage = () => {
  const { foodWasteLogs = [], addFoodWasteRecord, deleteFoodWasteRecord } = useData();

  const [activeTab, setActiveTab] = useState('food-waste'); // 'food-waste' | 'hostel-overview'

  // Food Waste Form State
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState('Lunch');
  const [canteenName, setCanteenName] = useState('Central Dining Hall / Mess');
  const [expectedStudents, setExpectedStudents] = useState('');
  const [actualStudentsServed, setActualStudentsServed] = useState('');
  const [foodPreparedKg, setFoodPreparedKg] = useState('');
  const [foodWastedKg, setFoodWastedKg] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute live real statistics from existing records
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = foodWasteLogs.filter((l) => l.date === todayStr);

  const totalPreparedToday = todayLogs.reduce((acc, curr) => acc + (Number(curr.foodPreparedKg) || 0), 0);
  const totalWastedToday = todayLogs.reduce((acc, curr) => acc + (Number(curr.foodWastedKg) || 0), 0);
  const todayWastePercentage =
    totalPreparedToday > 0 ? ((totalWastedToday / totalPreparedToday) * 100).toFixed(1) : '0.0';

  const totalHistoricalPrepared = foodWasteLogs.reduce((acc, curr) => acc + (Number(curr.foodPreparedKg) || 0), 0);
  const totalHistoricalWasted = foodWasteLogs.reduce((acc, curr) => acc + (Number(curr.foodWastedKg) || 0), 0);
  const overallWastePercentage =
    totalHistoricalPrepared > 0
      ? ((totalHistoricalWasted / totalHistoricalPrepared) * 100).toFixed(1)
      : '0.0';

  const totalStudentsServedAllTime = foodWasteLogs.reduce(
    (acc, curr) => acc + (Number(curr.actualStudentsServed) || 0),
    0
  );

  const handleSubmitFoodWaste = async (e) => {
    e.preventDefault();
    if (!expectedStudents || !actualStudentsServed || !foodPreparedKg || foodWastedKg === '') return;

    setIsSubmitting(true);
    try {
      await addFoodWasteRecord({
        date,
        mealType,
        canteenName,
        expectedStudents: Number(expectedStudents),
        actualStudentsServed: Number(actualStudentsServed),
        foodPreparedKg: Number(foodPreparedKg),
        foodWastedKg: Number(foodWastedKg),
        notes: notes.trim(),
      });

      // Reset numeric inputs
      setExpectedStudents('');
      setActualStudentsServed('');
      setFoodPreparedKg('');
      setFoodWastedKg('');
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Hostel & Canteen Governance"
        subtitle="Track real-time mess consumption, food waste analytics, and hostel occupancy metrics."
        badge="Canteen & Hostel Admin"
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <button
          onClick={() => setActiveTab('food-waste')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'food-waste'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Food Waste & Consumption Tracking</span>
          {foodWasteLogs.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'food-waste' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {foodWasteLogs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('hostel-overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'hostel-overview'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Hostel Occupancy & Vendor Overview</span>
        </button>
      </div>

      {/* TAB 1: FOOD WASTE MANAGEMENT */}
      {activeTab === 'food-waste' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Today's Food Prepared
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {totalPreparedToday.toFixed(1)} <span className="text-sm font-normal text-slate-500">kg</span>
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {todayLogs.length} meal session(s) logged today
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Today's Food Wasted
              </span>
              <h3 className="text-2xl font-black text-rose-600 mt-1">
                {totalWastedToday.toFixed(1)} <span className="text-sm font-normal text-slate-500">kg</span>
              </h3>
              <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                {todayWastePercentage}% Waste Rate Today
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Overall Average Waste %
              </span>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {overallWastePercentage}%
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Total {totalHistoricalWasted.toFixed(1)} kg / {totalHistoricalPrepared.toFixed(1)} kg prepared
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Students Served (Total)
              </span>
              <h3 className="text-2xl font-black text-teal-600 mt-1">
                {totalStudentsServedAllTime.toLocaleString()}
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 block">Across all recorded sessions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real Data Entry Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-teal-600" /> Log Meal Consumption
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md">
                  Real Data Entry
                </span>
              </div>

              <form onSubmit={handleSubmitFoodWaste} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Meal Type
                    </label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Canteen / Mess Hall
                  </label>
                  <input
                    type="text"
                    required
                    value={canteenName}
                    onChange={(e) => setCanteenName(e.target.value)}
                    placeholder="Central Dining Hall / Mess"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Expected Students
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={expectedStudents}
                      onChange={(e) => setExpectedStudents(e.target.value)}
                      placeholder="e.g. 800"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Actual Served
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={actualStudentsServed}
                      onChange={(e) => setActualStudentsServed(e.target.value)}
                      placeholder="e.g. 740"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Food Prepared (kg)
                    </label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="0"
                      value={foodPreparedKg}
                      onChange={(e) => setFoodPreparedKg(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Food Wasted (kg)
                    </label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="0"
                      value={foodWastedKg}
                      onChange={(e) => setFoodWastedKg(e.target.value)}
                      placeholder="e.g. 15.5"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Instant Calculation Preview */}
                {foodPreparedKg && foodWastedKg !== '' && Number(foodPreparedKg) > 0 && (
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 space-y-0.5">
                    <p className="font-bold flex items-center justify-between">
                      <span>Calculated Waste %:</span>
                      <span className="text-sm font-black">
                        {((Number(foodWastedKg) / Number(foodPreparedKg)) * 100).toFixed(1)}%
                      </span>
                    </p>
                    <p className="text-[10px] text-teal-700">
                      Formula: (Food Wasted ÷ Food Prepared) × 100
                    </p>
                  </div>
                )}

                {/* Notes with Voice Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold uppercase tracking-wider text-slate-600">
                      Canteen Notes / Observations
                    </label>
                    <VoiceInputButton
                      currentValue={notes}
                      onTranscript={(text) => setNotes(text)}
                      mode="append"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Lower turnout due to semester practicals. Excess rice redistributed..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 hover:bg-teal-700 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <Utensils className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Record Meal Statistics'}
                </button>
              </form>
            </div>

            {/* Historical Food Waste Records Table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-slate-700" /> Historical Canteen Waste Records
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {foodWasteLogs.length} Total Records
                </span>
              </div>

              {foodWasteLogs.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <Scale className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-sm">No food waste records logged yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter real meal consumption metrics using the form to start tracking waste percentages.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 pl-1">Date & Meal</th>
                        <th className="pb-3">Students (Exp / Act)</th>
                        <th className="pb-3">Prepared (kg)</th>
                        <th className="pb-3">Wasted (kg)</th>
                        <th className="pb-3">Waste %</th>
                        <th className="pb-3">Notes</th>
                        <th className="pb-3 text-right pr-1">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {foodWasteLogs.map((log) => {
                        const prep = Number(log.foodPreparedKg) || 0;
                        const waste = Number(log.foodWastedKg) || 0;
                        const wastePct =
                          prep > 0 ? ((waste / prep) * 100).toFixed(1) : log.wastePercentage || '0.0';
                        const logId = log._id || log.id || log.logId;

                        return (
                          <tr key={logId} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 pl-1 font-bold text-slate-900">
                              <div>{log.date}</div>
                              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                                {log.mealType}
                              </span>
                            </td>
                            <td className="py-3 text-slate-700">
                              <span className="font-bold">{log.actualStudentsServed}</span> /{' '}
                              <span className="text-slate-400">{log.expectedStudents}</span>
                            </td>
                            <td className="py-3 font-semibold text-slate-800">{prep} kg</td>
                            <td className="py-3 font-semibold text-rose-600">{waste} kg</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  Number(wastePct) > 10
                                    ? 'bg-rose-100 text-rose-800'
                                    : Number(wastePct) > 5
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {wastePct}%
                              </span>
                            </td>
                            <td className="py-3 text-slate-500 max-w-xs truncate">
                              {log.notes || '—'}
                            </td>
                            <td className="py-3 text-right pr-1">
                              <button
                                type="button"
                                onClick={() => deleteFoodWasteRecord(logId)}
                                title="Delete record"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOSTEL OCCUPANCY & VENDOR RATINGS */}
      {activeTab === 'hostel-overview' && (
        <div className="space-y-6">
          {/* Block Occupancy Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Hostel Block A (Boys)</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">780 / 800 Occupied</h3>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full w-[97.5%]" />
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
                <Utensils className="w-5 h-5 text-teal-600" /> Mess Vendor Ratings & Student Feedback Summary
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
      )}
    </div>
  );
};
