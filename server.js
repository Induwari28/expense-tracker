const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.static(path.join(__dirname, 'public')));

// ADD THIS LINE: It tells the browser to ignore the missing icon
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/api/test', (req, res) => {
    res.json({ message: "Success! The Backend is alive." });
});

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});