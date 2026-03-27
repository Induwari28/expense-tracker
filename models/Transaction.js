const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // 1. Link to the User (The "Owner" of this expense)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // 2. What was bought
  text: {
    type: String,
    required: true
  },
  // 3. How much it cost
  amount: {
    type: Number,
    required: true
  },
  // 4. The Group (The "New Line" you wanted!)
  category: { 
    type: String, 
    default: 'Other' 
  }, 
  // 5. When it happened
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);