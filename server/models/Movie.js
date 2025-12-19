const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String },
  description: { type: String },
  cast: [{ type: String }],
  // No seats or dates here anymore!
});

module.exports = mongoose.model('Movie', MovieSchema);