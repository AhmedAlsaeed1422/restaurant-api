const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

// Database Configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // Required for Render PostgreSQL
};

const pool = new Pool(dbConfig);

// GET All Items
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err.message);
    res.status(500).send('Server Error');
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// GET a Single Item by ID
app.get('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).send('Item not found');
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching item:', err.message);
      res.status(500).send('Server Error');
    }
  });
  // POST - Add a New Item
app.post('/items', async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).send('Name and description are required');
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding item:', err.message);
      res.status(500).send('Server Error');
    }
  });
// PUT - Update an Item by ID
app.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        [name, description, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).send('Item not found');
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error updating item:', err.message);
      res.status(500).send('Server Error');
    }
  });
  // DELETE - Remove an Item by ID
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).send('Item not found');
      }
  
      res.send('Item deleted successfully');
    } catch (err) {
      console.error('Error deleting item:', err.message);
      res.status(500).send('Server Error');
    }
  });
  
  
