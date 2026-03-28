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
router.post('/', async (req, res) => {
    try {
        console.log("Incoming Data:", req.body); // Spy Line

        const { text, amount, category } = req.body;

        const newTransaction = new Transaction({
            text,
            amount,
            category: category || 'Other' 
        });

        await newTransaction.save();
        res.json(newTransaction);
    } catch (err) {
        console.error("Save Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- 3. THE "RESET MONTH" PART (DELETE MANY) ---
// @route   DELETE api/transactions/reset/:month
router.delete('/reset/:month', async (req, res) => {
    try {
        const month = parseInt(req.params.month);
        const year = new Date().getFullYear();

        console.log(`🧹 Attempting to reset month: ${month} of year ${year}`);

        // Calculate the first and last day of the selected month
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

        const result = await Transaction.deleteMany({
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        console.log(`✅ Success: Removed ${result.deletedCount} items.`);
        res.json({ msg: 'Month reset successfully', count: result.deletedCount });
    } catch (err) {
        console.error("Reset Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- 4. THE "DELETE SINGLE" PART (DELETE ONE) ---
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