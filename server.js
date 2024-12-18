const express = require('express');
const mysql = require('mysql2');
require('dotenv').config(); // For using environment variables

const app = express();
const PORT = process.env.PORT || 3000; // Use Heroku's $PORT or fallback to 3000 for local testing

// Middleware
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,      // Hostname from Heroku Config Vars
    user: process.env.DB_USER,      // Database username
    password: process.env.DB_PASS,  // Database password
    database: process.env.DB_NAME,  // Database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit if database connection fails
    }
    console.log('Connected to the MySQL database.');
});

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant API!');
});

// Fetch All Dishes
app.get('/dishes', (req, res) => {
    const query = 'SELECT * FROM dishes';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching dishes:', err.message);
            return res.status(500).json({ error: 'Failed to fetch dishes.' });
        }
        res.json(results);
    });
});

// Add a New Dish
app.post('/dishes', (req, res) => {
    const { name, price, category, description } = req.body;
    const query = 'INSERT INTO dishes (name, price, category, description) VALUES (?, ?, ?, ?)';
    db.query(query, [name, price, category, description], (err) => {
        if (err) {
            console.error('Error adding dish:', err.message);
            return res.status(500).json({ error: 'Failed to add the dish.' });
        }
        res.status(201).json({ message: 'Dish added successfully!' });
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
