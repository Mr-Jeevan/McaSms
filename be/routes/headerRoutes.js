const express = require('express');
const router = express.Router();
const ColumnHeader = require('../models/header');

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

// PUT /api/headers/:id - rename header
router.put('/:id', async (req, res) => {
    try {
        const { title } = req.body;
        const { id } = req.params;

        const updated = await ColumnHeader.findByIdAndUpdate(
            id,
            { title },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Header not found' });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Failed to rename header', error: err.message });
    }
});
// DELETE /api/headers/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ColumnHeader.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: 'Header not found' });

        res.json({ message: 'Header deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete header', error: err.message });
    }
});

module.exports = router;
