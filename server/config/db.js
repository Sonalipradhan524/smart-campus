import mongoose from 'mongoose';
import dns from 'dns';
import { setMongoConnected, getIsMongoConnected } from './dataStore.js';

// Force public DNS resolution for Mongo Atlas SRV lookup on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // fallback silently
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusos';
  try {
    console.log(`[Database] Connecting to MongoDB Atlas cluster...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    setMongoConnected(true);
    console.log(`[Database] 🚀 MongoDB Atlas Connected successfully! Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    setMongoConnected(false);
    console.warn(`[Database Mode] Atlas MongoDB connection error: ${error.message}`);
    console.log(`[Database Mode] ⚡ Switched to CampusOS High-Speed Dynamic Fallback Engine.`);
    return false;
  }
};

export const getDBStatus = () => getIsMongoConnected();
