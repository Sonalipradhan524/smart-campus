import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    logId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String, default: '' },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '' }
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
