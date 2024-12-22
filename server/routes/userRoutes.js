// userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware'); // Import the token verification middleware
const router = express.Router();

// Register
router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role });
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
});

// Get User Events
router.get('/my-events', verifyToken, async (req, res) => {
    const userId = req.user.id; // Get user ID from the decoded token

    try {
        // Find the user by ID and populate the events array
        const user = await User.findById(userId).populate('events');

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Handle user not found
        }

        // Return the events the user has joined
        return res.json(user.events);
    } catch (error) {
        console.error('Error fetching user events:', error); // Log the error
        return res.status(500).json({ message: 'Server error' }); // Return a 500 error for server issues
    }
});

module.exports = router;