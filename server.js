// Import required modules
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Required for Render-hosted PostgreSQL
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'routes/frontend')));

// Root route: Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'routes/frontend', 'index.html'));
});

// API route: Fetch all items from the database
app.get('/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching items:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API route: Add a new item to the database
app.post('/items', async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
    }

    try {
        const query = 'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *';
        const values = [name, description];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting item:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
