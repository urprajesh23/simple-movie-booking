const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show' }, // Changed from movieId
  seatNumbers: [{ type: String }],
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);