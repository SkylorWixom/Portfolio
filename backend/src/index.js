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
// Add a new project
app.post('/projects', async (req, res) => {
    try {
      const { title, description, github_link, demo_link } = req.body;
  
      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required." });
      }
  
      const result = await pool.query(
        "INSERT INTO projects (title, description, github_link, demo_link) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, description, github_link, demo_link]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
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
  
  // Delete a project by ID
app.delete('/projects/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the project exists
      const project = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
      if (project.rows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
  
      // Delete the project
      await pool.query("DELETE FROM projects WHERE id = $1", [id]);
  
      res.json({ message: `Project with ID ${id} deleted successfully.` });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });  

// Update a project by ID
app.put('/projects/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, github_link, demo_link } = req.body;
  
      // Check if the project exists
      const project = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
      if (project.rows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
  
      // Update the project
      const updatedProject = await pool.query(
        "UPDATE projects SET title = $1, description = $2, github_link = $3, demo_link = $4 WHERE id = $5 RETURNING *",
        [title || project.rows[0].title, 
         description || project.rows[0].description, 
         github_link || project.rows[0].github_link, 
         demo_link || project.rows[0].demo_link, 
         id]
      );
  
      res.json(updatedProject.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
