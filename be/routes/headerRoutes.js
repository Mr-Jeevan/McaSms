const express = require('express');
const router = express.Router();
const headerService = require('../services/headerService');

// POST /api/headers — Add new column
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ message: "Title is required" });

        const newHeader = await headerService.createHeader(title);
        res.status(201).json(newHeader);
    } catch (err) {
        if (err.message === 'Header already exists') {
            return res.status(409).json({ message: "Header already exists" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET /api/headers — Get all columns
router.get('/', async (req, res) => {
    try {
        const headers = await headerService.getAllHeaders();
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

        const updated = await headerService.updateHeader(id, title);
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
        const deleted = await headerService.deleteHeader(id);

        if (!deleted) return res.status(404).json({ message: 'Header not found' });

        res.json(deleted);
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete header', error: err.message });
    }
});

module.exports = router;
