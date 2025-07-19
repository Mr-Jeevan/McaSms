const express = require('express');
const router = express.Router();
const Student = require('../models/McaTwoStudents');

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

// GET a single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student', error: err.message });
  }
});

// POST create new student
router.post('/', async (req, res) => {
  try {
    // FIX: Extract the student data from req.body.data
    const newStudent = new Student({ data: req.body.data });
    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error creating student', error: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    // FIX: Use req.body.data to update the student's data field
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { data: req.body.data }, // Use req.body.data instead of req.body
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating student', error: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err.message });
  }
});

module.exports = router;