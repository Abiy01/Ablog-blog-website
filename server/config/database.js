import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI is not defined');
      if (process.env.VERCEL) {
        // In Vercel, don't exit - let it fail gracefully
        console.error('Please add MONGODB_URI to Vercel environment variables');
      } else {
        process.exit(1);
      }
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

export default connectDB;

