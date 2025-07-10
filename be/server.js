const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/srms')
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Routes
app.use('/api/headers', require('./routes/headerRoutes'));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
