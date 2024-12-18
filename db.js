const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',       // MySQL host (localhost if local)
    user: 'root',            // Your MySQL username
    password: '',            // Your MySQL password (leave blank if none)
    database: 'restaurant_db' // Database name
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('MySQL Connected...');
});

module.exports = db; // Export the database connection
