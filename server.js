const express = require('express');
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',      // Database host
  user: process.env.DB_USER || 'root',           // Database user
  password: process.env.DB_PASS || '',           // Database password
  database: process.env.DB_NAME || 'restaurant_db', // Database name
  port: 3306                                     // MySQL port
});

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to the database successfully!');
});

// Route to fetch dishes
app.get('/dishes', (req, res) => {
  connection.query('SELECT * FROM dishes', (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to fetch dishes' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Route to add a new dish
app.post('/dishes', (req, res) => {
  const { name, price, category, description } = req.body;
  const query = 'INSERT INTO dishes (name, price, category, description) VALUES (?, ?, ?, ?)';
  connection.query(query, [name, price, category, description], (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Failed to add dish' });
    } else {
      res.status(201).send({ message: 'Dish added successfully!', dishId: result.insertId });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
