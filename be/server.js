const express = require('express');
const cors = require('cors');
const { admin } = require('./config/firebase');

const headerRoutes = require('./routes/headerRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase connection
try {
  console.log('Firebase Admin SDK initialized successfully');
  console.log('Project ID:', admin.app().options.projectId);
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  console.log('Please make sure to update your Firebase configuration in config/firebase.js');
}

app.use('/api/headers', headerRoutes);
app.use('/api/students', studentRoutes); // ✅

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
