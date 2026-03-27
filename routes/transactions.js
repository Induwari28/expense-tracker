const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// --- 1. THE "READ" PART (GET) ---
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- 2. THE "SAVE" PART (POST) ---
// UPDATED: Now it accepts 'category' from the frontend
router.post('/', async (req, res) => {
    try {
        // --- SPY LINE ---
        console.log("Incoming Data:", req.body); 

        const { text, amount, category } = req.body;

        const newTransaction = new Transaction({
            text,
            amount,
            category: category || 'Other' // This ensures 'Other' is only a backup
        });

        await newTransaction.save();
        res.json(newTransaction);
    } catch (err) {
        console.error("Save Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- 3. THE "DELETE" PART (With Spy Logs) ---
router.delete('/:id', async (req, res) => {
    try {
        console.log("Attempting to delete ID:", req.params.id); // Spy Log

        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            console.log("❌ Error: Item not found in database.");
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        await transaction.deleteOne();
        console.log("✅ Success: Item deleted!");
        res.json({ msg: 'Transaction removed' });

    } catch (err) {
        console.error("❌ Server Error:", err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;