import express from 'express';

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Define your routes and application logic here
// Define a route
app.get('/', (req, res) => {
    res.send('Welcome to auth service');
});

export default app;
