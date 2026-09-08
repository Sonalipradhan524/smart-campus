import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalFee: { type: Number, default: 85000 },
    paidFee: { type: Number, default: 0 },
    dueFee: { type: Number, default: 85000 },
    dueDate: { type: String, default: '2026-09-25' },
    transactions: [
      {
        id: { type: String },
        description: { type: String },
        amount: { type: Number },
        date: { type: String },
        status: { type: String, default: 'Paid' },
        method: { type: String, default: 'UPI' },
      },
    ],
  },
  { timestamps: true }
);

export const Fee = mongoose.model('Fee', feeSchema);
