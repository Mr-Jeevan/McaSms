const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables as early as possible
dotenv.config();

// Import your Mongoose Models
const McaOneStudent = require('./models/mcaOneStudents'); // Assuming McaOneStudent.js exports a model named 'McaOneStudent'
const authRoutes = require('./routes/authRoutes');
const McaTwoStudent = require('./models/mcaTwoStudents'); // Assuming McaTwoStudent.js exports a model named 'McaTwoStudent'

const headerRoutes = require('./routes/headerRoutes');

// Import the generic CRUD router factory
const createCrudRouter = require('./routes/createCrudRouter'); // Correct path to your generic router

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Essential for parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded request bodies

// MongoDB Connection
const connectDB = require('./config/db');

// Connect to Database
connectDB();

// Authentication routes
// Accessible at http://localhost:4000/api/auth
app.use('/api/auth', authRoutes);

// --- Mount API Routes using the Generic CRUD Router ---
// Routes for MCA One Students
app.use('/api/mcaone/students', createCrudRouter(McaOneStudent));

// Routes for MCA Two Students
app.use('/api/mcatwo/students', createCrudRouter(McaTwoStudent));

// REMINDER: In crudRouter.js, ensure 'isHeaderModel' correctly checks 'Model.modelName === 'Header'
// or whatever the actual model name for 'Header' is (e.g., 'McaTwoHeader').
app.use('/api/headers', headerRoutes); // Changed /api/header to /api/headers

// Basic root route for server status check
app.get('/', (req, res) => {
  res.send('MCA management BE is running'); // Fixed syntax
});

// Generic Error Handling Middleware (must be defined AFTER all routes)
// Correct parameter order: (err, req, res, next)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the full error stack for debugging
  res.status(500).send('Something went wrong on the server side'); // Fixed typo
});

// Port definition, using environment variable or default
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});