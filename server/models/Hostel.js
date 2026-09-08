import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    block: { type: String, required: true },
    roomNo: { type: String, required: true },
    floor: { type: String, default: '' },
    wardenName: { type: String, default: '' },
    wardenPhone: { type: String, default: '' },
    caretakerName: { type: String, default: '' },
    caretakerPhone: { type: String, default: '' },
    roommates: [
      {
        name: { type: String },
        roll: { type: String },
        dept: { type: String },
      },
    ],
    rules: [{ type: String }],
  },
  { timestamps: true }
);

export const Hostel = mongoose.model('Hostel', hostelSchema);
