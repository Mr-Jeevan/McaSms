const express = require('express');
const cors = require('cors');

const headerRoutes = require('./routes/headerRoutes');
const studentRoutes = require('./routes/studentRoutes'); // ✅

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/srms')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Mount API Routes using the Generic CRUD Router ---

// Routes for MCA One Students
// Accessible at http://localhost:3001/api/mcaone/students
app.use('/api/mcaone/students', createCrudRouter(McaOneStudent));

// Routes for MCA Two Students
// Accessible at http://localhost:3001/api/mcatwo/students
app.use('/api/mcatwo/students', createCrudRouter(McaTwoStudent));

// Routes for Headers (ensure your frontend uses /api/headers for consistency)
// Accessible at http://localhost:3001/api/headers
// REMINDER: In crudRouter.js, ensure 'isHeaderModel' correctly checks 'Model.modelName === 'Header''
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
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});