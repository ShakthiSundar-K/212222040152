import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { log } from '../middleware/logger';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    await log('backend', 'info', 'db', 'MongoDB connected');
  } catch (error: any) {
    await log('backend', 'fatal', 'db', `MongoDB connection error: ${error.message}`);
    process.exit(1); 
  }
};
