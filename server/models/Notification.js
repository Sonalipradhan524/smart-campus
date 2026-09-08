import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    notifId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null if broadcast to all
    type: { type: String, default: 'General' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
