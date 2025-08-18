const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// POST /api/auth/register — Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please enter all required fields." });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "A user with this email or username already exists." });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create and save the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error during registration.", error: err.message });
    }
});

// POST /api/auth/login — Log a user in
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide both email and password." });
        }

        // 2. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." }); 
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password." }); 
        }

        // 4. Create and sign a JWT
        const payload = {
            id: user._id,
            username: user.username
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET, // Make sure to add JWT_SECRET to your .env file
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({
            message: "Logged in successfully!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error during login.", error: err.message });
    }
});

module.exports = router;