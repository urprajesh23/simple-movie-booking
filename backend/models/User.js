const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String }, // Optional
  city: { type: String, required: true },
  pin: { type: String, required: true }, // Ideally hashed, but plain text for this demo
});

module.exports = mongoose.model('User', UserSchema);