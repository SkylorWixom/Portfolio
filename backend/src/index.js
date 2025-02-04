require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON data in requests

// Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});
// Get all projects
app.get('/projects', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
