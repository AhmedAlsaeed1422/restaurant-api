const express = require('express');
const { Pool } = require('pg'); // PostgreSQL library
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Database Configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // Required for Render PostgreSQL
});

console.log('Database Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant API!');
});

// 1. Fetch All Items
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Fetch a Single Item by ID
app.get('/items/:id', async (req, res) => {
  const { id } = req.params; // Extract ID from URL
  try {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the item if found
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error('Error fetching item by ID:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Add a New Item
app.post('/items', async (req, res) => {
  const { name, description } = req.body; // Extract data from request body
  try {
    const result = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]); // Return the newly created item
  } catch (err) {
    console.error('Error adding item:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Update an Item by ID
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the updated item
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error('Error updating item:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Delete an Item by ID
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM items WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length > 0) {
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error('Error deleting item:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
