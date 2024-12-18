const { Client } = require('pg');

const client = new Client({
    host: 'dpg-cth61nogph6c73d8mrig-a', // New host
    user: 'restaurant_api_85so_user',   // Your database username
    password: 'hkmcgqXr2UzMDaJ2iZKo85pj13Yx8C7s', // Your database password
    database: 'restaurant_api_85so',   // Database name
    port: 5432,                        // Default PostgreSQL port
    ssl: { rejectUnauthorized: false } // SSL must be enabled for cloud databases
});

client.connect()
    .then(() => console.log("Database connected successfully!"))
    .catch(err => console.error("Database connection failed:", err));
