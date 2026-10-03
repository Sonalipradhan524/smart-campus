import mongoose from 'mongoose';

const faceEmbeddingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    rollNo: { type: String, default: '' },
    employeeId: { type: String, default: '' },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    department: { type: String, default: '' },
    // Array of 128-dimensional embedding vectors captured from face registration
    embeddings: { type: [[Number]], required: true },
    faceImages: [{ type: String }], // Array of base64 face thumbnails
    registeredBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

export const FaceEmbedding = mongoose.model('FaceEmbedding', faceEmbeddingSchema);
