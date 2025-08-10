const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
// Note: In a production environment, this connection string should be stored in an environment variable.
mongoose.connect('mongodb://localhost:27017/agritech')
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
