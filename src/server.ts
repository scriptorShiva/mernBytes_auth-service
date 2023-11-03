import express from 'express';

const app = express();
const port = 3000; // Use the specified port or default to 3000

// Define a route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
});
