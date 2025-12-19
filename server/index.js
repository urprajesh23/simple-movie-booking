const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Default Route (to check if server is working)
app.get('/', (req, res) => {
  res.send('Movie Booking API is running...');
});

// --- CRITICAL PART: START THE SERVER ---
const PORT = process.env.PORT || 5000;

// ONLY run server if not in production (Vercel handles it differently)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;