require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Use Heroku's port or default to 3000

app.use(express.json());

// Sample route to test the app
app.get('/', (req, res) => {
    res.send('Restaurant API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
