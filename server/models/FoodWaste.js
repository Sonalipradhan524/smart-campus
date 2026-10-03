import mongoose from 'mongoose';

const foodWasteSchema = new mongoose.Schema(
  {
    logId: { type: String, required: true, unique: true },
    date: { type: String, required: true }, // e.g. '2026-10-01'
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
      required: true,
    },
    canteenName: {
      type: String,
      default: 'Central Dining Hall / Mess',
    },
    expectedStudents: {
      type: Number,
      required: true,
      min: 0,
    },
    actualStudentsServed: {
      type: Number,
      required: true,
      min: 0,
    },
    foodPreparedKg: {
      type: Number,
      required: true,
      min: 0,
    },
    foodWastedKg: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    loggedBy: {
      type: String,
      default: 'Campus Administration / Canteen Staff',
    },
  },
  { timestamps: true }
);

// Virtual for waste percentage
foodWasteSchema.virtual('wastePercentage').get(function () {
  if (!this.foodPreparedKg || this.foodPreparedKg <= 0) return 0;
  return Number(((this.foodWastedKg / this.foodPreparedKg) * 100).toFixed(1));
});

foodWasteSchema.set('toJSON', { virtuals: true });
foodWasteSchema.set('toObject', { virtuals: true });

export const FoodWaste = mongoose.model('FoodWaste', foodWasteSchema);
