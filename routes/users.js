const express = require('express');
const router = express.Router();
const User = require('../models/User');

// This handles the "POST" request from the Register page
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // 2. Create the new user
        user = new User({ name, email, password });
        
        // 3. Save to MongoDB
        await user.save();
        res.json({ msg: 'User registered successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- LOGIN ROUTE ---
// This handles the "POST" request when someone clicks the Login button
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        // 2. Check if the password is correct
        // (For now, we are checking the exact text. Later we will make it more secure!)
        if (user.password !== password) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        // 3. If everything is correct, send a success message
        res.json({
            msg: 'Login successful!',
            user: {
                id: user._id,
                name: user.name
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

