'use server';
import mongoose from 'mongoose';

export const dbConnect = async () => {
  if (mongoose?.connection?.readyState >= 1) {
    return; // Already connected
  }

  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not defined in the environment variables');
  }

  try {
    console.log(process.env.MONGO_URL)
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to the database');
  }
};
