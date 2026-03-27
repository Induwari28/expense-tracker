const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// 1. Open the Secret Box (.env file)
dotenv.config(); 

const app = express();

// 2. MIDDLEWARE: This allows the server to "read" data from your forms
app.use(express.json()); 

// 3. The Connection Check
console.log("--- Connection Check ---");
if (process.env.MONGO_URI) {
    console.log("Is MONGO_URI loading?: YES ✅");
    
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ MongoDB is Connected!'))
        .catch(err => console.log('❌ Error:', err.message));
} else {
    console.log("Is MONGO_URI loading?: NO ❌");
}

// 4. LINK THE ROUTES (The Brains of your app)
app.use('/api/users', require('./routes/users')); // For login/signup
app.use('/api/transactions', require('./routes/transactions')); // FOR THE MONEY! 💰

// 5. Serve the frontend files (HTML/CSS)
app.use(express.static(path.join(__dirname, 'public')));

// 6. Start the Server
app.listen(5000, () => console.log('🚀 Server is running on http://localhost:5000'));