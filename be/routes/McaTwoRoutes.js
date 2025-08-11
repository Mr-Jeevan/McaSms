const express = require('express');
const router = express.Router();
<<<<<<< HEAD:be/routes/studentRoutes.js
const studentService = require('../services/studentService');
=======
const Student = require('../models/mcaTwoStudents');
>>>>>>> 1130ee0faa482088e0e4d909034b0d2aa425b13d:be/routes/McaTwoRoutes.js

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

// GET a single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student', error: err.message });
  }
});

// POST create new student
router.post('/', async (req, res) => {
  try {
    const newStudent = await studentService.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: 'Error creating student', error: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const updated = await studentService.updateStudent(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating student', error: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await studentService.deleteStudent(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err.message });
  }
});

module.exports = router;