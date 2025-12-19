const router = require('express').Router();
const User = require('../models/User');

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, city, pin } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create new user
    const newUser = new User({ name, email, mobile, city, pin });
    const savedUser = await newUser.save();
    
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, pin } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check PIN (Simple check)
    if (user.pin !== pin) return res.status(400).json({ message: "Invalid PIN" });

    // Login success
    // In a real app, you would send a JWT token here. 
    // For now, we send the user info.
    const { pin: userPin, ...others } = user._doc; // Remove PIN from response
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;