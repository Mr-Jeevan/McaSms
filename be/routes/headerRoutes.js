const express = require('express');
const router = express.Router();
const ColumnHeader = require('../models/ColumnHeader');

// POST /api/headers — Add new column
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const existing = await ColumnHeader.findOne({ title });
    if (existing) return res.status(409).json({ message: "Header already exists" });

    const newHeader = new ColumnHeader({ title });
    await newHeader.save();
    res.status(201).json(newHeader);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/headers — Get all columns
router.get('/', async (req, res) => {
  try {
    const headers = await ColumnHeader.find().sort({ createdAt: 1 });
    res.json(headers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
