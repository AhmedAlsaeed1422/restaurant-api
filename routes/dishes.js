const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

// GET: Retrieve all dishes
router.get('/', (req, res) => {
    const query = 'SELECT * FROM dishes';
    db.query(query, (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// GET: Retrieve a single dish by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM dishes WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Dish not found' });
        }
        res.json(results[0]);
    });
});

// POST: Add a new dish
router.post('/', (req, res) => {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO dishes (name, price, category, description) VALUES (?, ?, ?, ?)';
    db.query(query, [name, price, category, description], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(201).json({ message: 'Dish added successfully', dishId: result.insertId });
    });
});

// PUT: Update a dish by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, category, description } = req.body;

    if (!name || !price || !category || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'UPDATE dishes SET name = ?, price = ?, category = ?, description = ? WHERE id = ?';
    db.query(query, [name, price, category, description, id], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Dish not found' });
        }
        res.json({ message: 'Dish updated successfully' });
    });
});

// DELETE: Remove a dish by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM dishes WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Dish not found' });
        }
        res.json({ message: 'Dish deleted successfully' });
    });
});

module.exports = router; // Export the router
