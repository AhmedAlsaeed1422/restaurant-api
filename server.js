const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // Import the database connection
const dishesRoutes = require('./routes/dishes'); // Import dishes routes

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON data from requests
app.use(cors()); // Allow cross-origin requests

// Routes
app.use('/dishes', dishesRoutes); // All dish-related routes

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
