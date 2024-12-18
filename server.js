require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit if the database fails
    }
    console.log('Connected to database');
});

app.get('/', (req, res) => {
    res.send('Hello! Your app is running correctly.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
