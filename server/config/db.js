const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // Attempt to connect
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1); // Stop server if database fails
  }
};

// CRITICAL: This line exports the function so index.js can use it
module.exports = connectDB;