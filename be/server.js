const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const headerRoutes = require('./routes/headerRoutes');
const McaTwoRoutes = require('./routes/McaTwoRoutes'); // ✅

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/srms')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/headers', headerRoutes);
app.use('/api/students', McaTwoRoutes); // ✅

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
