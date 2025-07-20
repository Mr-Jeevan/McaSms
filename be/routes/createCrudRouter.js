const express = require('express');

/**
 * Creates an Express Router with standard CRUD operations for a given Mongoose Model.
 * Handles special cases for Student models (with Map data) and Header models.
 * @param {mongoose.Model} Model - The Mongoose Model
 * @returns {express.Router} Configured CRUD router
 */
const createCrudRouter = (Model) => {
    const router = express.Router();

    // Helpers to check model type
    const isStudentModel = Model.modelName.includes('Student');
    const isHeaderModel = Model.modelName.includes('Header');

    // Convert Map to plain object for responses
    const mapToObject = (map) => map ? Object.fromEntries(map.entries()) : {};

    // Convert request data to Map for Student models
    const prepareStudentData = (input) => {
        const data = input.data || input;
        return data ? new Map(Object.entries(data)) : new Map();
    };

    // GET all documents
    router.get('/', async (req, res) => {
        try {
            const documents = await Model.find();
            if (isStudentModel) {
                const formatted = documents.map(doc => ({
                    _id: doc._id,
                    data: mapToObject(doc.data),
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt
                }));
                res.json(formatted);
            } else {
                res.json(documents);
            }
        } catch (err) {
            res.status(500).json({ 
                message: "Server error", 
                error: err.message 
            });
        }
    });

    // GET single document
    router.get('/:id', async (req, res) => {
        try {
            const document = await Model.findById(req.params.id);
            if (!document) {
                return res.status(404).json({ message: 'Document not found' });
            }

            if (isStudentModel) {
                res.json({
                    _id: document._id,
                    data: mapToObject(document.data),
                    createdAt: document.createdAt,
                    updatedAt: document.updatedAt
                });
            } else {
                res.json(document);
            }
        } catch (err) {
            res.status(500).json({ 
                message: "Server error", 
                error: err.message 
            });
        }
    });

    // POST new document
    router.post('/', async (req, res) => {
        try {
            let documentData;
            
            if (isStudentModel) {
                documentData = { 
                    data: prepareStudentData(req.body) 
                };
            } else if (isHeaderModel) {
                const { title } = req.body;
                if (!title) {
                    return res.status(400).json({ message: "Title is required" });
                }
                documentData = { title };
            } else {
                documentData = req.body;
            }

            const newDocument = new Model(documentData);
            const savedDocument = await newDocument.save();

            if (isStudentModel) {
                res.status(201).json({
                    _id: savedDocument._id,
                    data: mapToObject(savedDocument.data),
                    createdAt: savedDocument.createdAt,
                    updatedAt: savedDocument.updatedAt
                });
            } else {
                res.status(201).json(savedDocument);
            }
        } catch (err) {
            res.status(400).json({
                message: "Validation or save error",
                error: err.message,
                errors: err.errors || undefined
            });
        }
    });

    // PUT update document
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            let updateData;

            if (isStudentModel) {
                updateData = { 
                    data: prepareStudentData(req.body) 
                };
            } else if (isHeaderModel) {
                const { title } = req.body;
                if (!title) {
                    return res.status(400).json({ message: "Title is required" });
                }
                updateData = { title };
            } else {
                updateData = req.body;
            }

            const updatedDocument = await Model.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedDocument) {
                return res.status(404).json({ message: 'Document not found' });
            }

            if (isStudentModel) {
                res.json({
                    _id: updatedDocument._id,
                    data: mapToObject(updatedDocument.data),
                    createdAt: updatedDocument.createdAt,
                    updatedAt: updatedDocument.updatedAt
                });
            } else {
                res.json(updatedDocument);
            }
        } catch (err) {
            res.status(400).json({ 
                message: 'Failed to update document', 
                error: err.message 
            });
        }
    });

    // DELETE document
    router.delete('/:id', async (req, res) => {
        try {
            const deletedDocument = await Model.findByIdAndDelete(req.params.id);
            if (!deletedDocument) {
                return res.status(404).json({ message: 'Document not found' });
            }
            res.json({ message: 'Document deleted successfully' });
        } catch (err) {
            res.status(500).json({ 
                message: 'Failed to delete document', 
                error: err.message 
            });
        }
    });

    return router;
};

module.exports = createCrudRouter;