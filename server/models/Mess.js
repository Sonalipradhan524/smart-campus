import mongoose from 'mongoose';

const messSchema = new mongoose.Schema(
  {
    todayDay: { type: String, default: 'Tuesday' },
    breakfast: {
      title: { type: String, default: '' },
      sides: { type: String, default: '' },
      time: { type: String, default: '' },
    },
    lunch: {
      title: { type: String, default: '' },
      sides: { type: String, default: '' },
      time: { type: String, default: '' },
    },
    snacks: {
      title: { type: String, default: '' },
      sides: { type: String, default: '' },
      time: { type: String, default: '' },
    },
    dinner: {
      title: { type: String, default: '' },
      sides: { type: String, default: '' },
      time: { type: String, default: '' },
    },
    weeklyHighlights: [
      {
        day: { type: String },
        lunch: { type: String },
        dinner: { type: String },
      },
    ],
    feedbacks: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        mealType: { type: String },
        rating: { type: Number },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Mess = mongoose.model('Mess', messSchema);
