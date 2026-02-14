const mongoose = require('mongoose');

// Cache connection for serverless
let cachedConnection = null;

const connectDB = async () => {
  // Reuse existing connection in serverless
  if (cachedConnection) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Don't exit in serverless environment
    if (process.env.VERCEL) {
      return null;
    }
    process.exit(1);
  }
};

module.exports = connectDB;
