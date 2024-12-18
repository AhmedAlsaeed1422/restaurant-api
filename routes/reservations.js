const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Add a new reservation
router.post('/', (req, res) => {
    const { customer_name, reservation_time, number_of_people, special_request } = req.body;
    db.query(
        'INSERT INTO reservations (customer_name, reservation_time, number_of_people, special_request) VALUES (?, ?, ?, ?)',
        [customer_name, reservation_time, number_of_people, special_request],
        (err, result) => {
            if (err) throw err;
            res.status(201).json({ message: 'Reservation created successfully', reservationId: result.insertId });
        }
    );
});

module.exports = router;
