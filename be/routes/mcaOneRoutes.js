const express = require('express');

const router = express.Router();

// Example: Get all MCA One students
router.get('/students', (req, res) => {
    // Replace with actual logic to fetch students
    res.json({ message: 'List of MCA One students' });
});

// Example: Add a new MCA One student
router.post('/students', (req, res) => {
    // Replace with actual logic to add a student
    res.json({ message: 'MCA One student added' });
});

// Example: Get a specific MCA One student by ID
router.get('/students/:id', (req, res) => {
    // Replace with actual logic to fetch a student by ID
    res.json({ message: `Details of MCA One student with ID ${req.params.id}` });
});

// Example: Update a specific MCA One student by ID
router.put('/students/:id', (req, res) => {
    // Replace with actual logic to update a student by ID
    res.json({ message: `MCA One student with ID ${req.params.id} updated` });
});

// Example: Delete a specific MCA One student by ID
router.delete('/students/:id', (req, res) => {
    // Replace with actual logic to delete a student by ID
    res.json({ message: `MCA One student with ID ${req.params.id} deleted` });
});

module.exports = router;
