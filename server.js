require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // For secure connection to Render-hosted Postgres
};

const pool = new Pool(dbConfig);

// Test database connection
pool.connect()
    .then(() => console.log('Database connected:', dbConfig))
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });

// Preloaded data setup
async function preloadData() {
    const query = `
        INSERT INTO items (name, description) VALUES 
        ('Burger', 'Delicious beef burger with cheese and lettuce'),
        ('Pizza', 'Margherita pizza with extra cheese'),
        ('Pasta', 'Creamy Alfredo pasta'),
        ('Kabsa', 'Saudi traditional rice dish with chicken'),
        ('Tacos', 'Mexican tacos with spicy beef'),
        ('Shawarma', 'Chicken shawarma wrap with garlic sauce'),
        ('Biryani', 'Indian spicy chicken biryani'),
        ('Salad', 'Fresh vegetable salad with olive oil'),
        ('Sushi', 'Assorted sushi rolls with soy sauce'),
        ('Steak', 'Grilled steak served with mashed potatoes'),
        ('Falafel', 'Middle eastern falafel with tahini'),
        ('Kebab', 'Lamb kebabs with naan bread'),
        ('Soup', 'Hot chicken soup'),
        ('Cake', 'Chocolate cake with cream'),
        ('Ice Cream', 'Vanilla ice cream with caramel topping');
    `;
    try {
        await pool.query(query);
        console.log('Preloaded data inserted successfully.');
    } catch (error) {
        console.error('Error inserting preloaded data:', error.message);
    }
}

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant API!');
});

// GET all items
app.get('/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from database.' });
    }
});

// GET single item by ID
app.get('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Item not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from database.' });
    }
});

// POST to add a new item
app.post('/items', async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error inserting data into database.' });
    }
});

// Start the server
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await preloadData();
});
app.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        [name, description, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error updating item', error });
    }
  });
  app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.json({ message: 'Item deleted successfully', item: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting item', error });
    }
  });
  
