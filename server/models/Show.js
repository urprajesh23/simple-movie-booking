const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatreName: { type: String, required: true }, // e.g., "Theatre A"
  time: { type: String, required: true },        // e.g., "10:00 AM"
  seats: [
    {
      id: { type: String }, // e.g., "A1"
      isBooked: { type: Boolean, default: false },
      bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ]
});

module.exports = mongoose.model('Show', ShowSchema);