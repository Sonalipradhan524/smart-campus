import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { VoiceInputButton } from '../../components/common/VoiceInputButton';
import { Utensils, Star, Send, Coffee, Sun, Sunset, Moon, CheckCircle2 } from 'lucide-react';

export const MessPage = () => {
  const { messMenu, submitMessFeedback } = useData();

  const [rating, setRating] = useState(5);
  const [mealType, setMealType] = useState('Lunch');
  const [comment, setComment] = useState('');

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    submitMessFeedback({ rating, mealType, comment });
    setComment('');
  };

  const mealCards = [
    { title: 'Breakfast', icon: Coffee, time: messMenu?.breakfast?.time || '07:30 AM - 09:15 AM', details: messMenu?.breakfast?.title || 'Puri, Ghuguni, Tea', sides: messMenu?.breakfast?.sides || 'Central Hall', color: 'border-amber-200 bg-amber-50/50' },
    { title: 'Lunch', icon: Sun, time: messMenu?.lunch?.time || '12:30 PM - 02:15 PM', details: messMenu?.lunch?.title || 'Rice, Dal, Veg Curry', sides: messMenu?.lunch?.sides || 'Salad & Curd', color: 'border-teal-200 bg-teal-50/50' },
    { title: 'Snacks', icon: Sunset, time: messMenu?.snacks?.time || '05:00 PM - 06:15 PM', details: messMenu?.snacks?.title || 'Snacks & Tea', sides: messMenu?.snacks?.sides || 'Refreshment Desk', color: 'border-orange-200 bg-orange-50/50' },
    { title: 'Dinner', icon: Moon, time: messMenu?.dinner?.time || '08:00 PM - 09:45 PM', details: messMenu?.dinner?.title || 'Roti, Dal & Curry', sides: messMenu?.dinner?.sides || 'Dessert', color: 'border-purple-200 bg-purple-50/50' },
  ];

  const weeklyHighlights = messMenu?.weeklyHighlights || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Hostel Mess & Dining Hub"
        subtitle="Daily menu updates, nutritional highlights, and interactive student meal feedback."
        badge={`${messMenu?.todayDay || 'Today'}'s Menu`}
      />

      {/* Today's 4 Meals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mealCards.map((meal) => {
          const Icon = meal.icon;
          return (
            <div key={meal.title} className={`p-5 rounded-3xl border ${meal.color} shadow-xs flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{meal.title}</span>
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-[10px] font-bold text-slate-600 mb-3 border border-slate-200">
                  {meal.time}
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{meal.details}</h4>
                <p className="text-xs text-slate-500 mt-2 font-medium">{meal.sides}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Weekly Plan & Feedback Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Diet Plan Table (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-teal-600" /> Weekly Mess Menu Schedule
          </h3>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Day</th>
                  <th className="p-3">Special Lunch</th>
                  <th className="p-3 rounded-r-xl">Dinner Highlight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {weeklyHighlights.map((row) => (
                  <tr key={row.day} className={row.day === messMenu?.todayDay ? 'bg-teal-50/70 font-bold text-teal-900' : 'hover:bg-slate-50'}>
                    <td className="p-3 flex items-center gap-2">
                      {row.day === messMenu?.todayDay && <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />}
                      {row.day}
                    </td>
                    <td className="p-3 text-slate-700">{row.lunch}</td>
                    <td className="p-3 text-slate-700">{row.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mess Feedback Form (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Rate Meal Quality
          </h3>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Select Meal
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Comments / Food Quality Feedback
                </label>
                <VoiceInputButton
                  currentValue={comment}
                  onTranscript={(text) => setComment(text)}
                  mode="append"
                />
              </div>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Give feedback on taste, hygiene, or quantity. Dictate with voice if preferred..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 hover:bg-amber-600 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
