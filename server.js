const express = require('express'); // Import Express
const path = require('path'); // Import Path for file paths
const app = express(); // Initialize Express App

// Define the Port (Heroku uses process.env.PORT)
const port = process.env.PORT || 3000;

// Middleware to serve static files like CSS, JS, and Images
app.use(express.static(path.join(__dirname, 'routes', 'frontend')));

// Root Route: Serve the 'index.html' file when accessing "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'routes', 'frontend', 'index.html'));
});

// Example API Route (Optional)
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
