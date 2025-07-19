const express = require('express');

/**
 * Creates an Express Router with standard CRUD operations for a given Mongoose Model.
 * It also handles specific request/response formats for 'Student' and 'Header' models.
 * @param {mongoose.Model} Model - The Mongoose Model (e.g., McaOneStudent, McaTwoStudent, Header).
 * @returns {express.Router} An Express Router configured with CRUD routes.
 */
const createCrudRouter = (Model) => {
    const router = express.Router();

    // Helper to check if the model is a Student model
    const isStudentModel = Model.modelName.includes('Student');
    // Helper to check if the model is the Header model
    const isHeaderModel = Model.modelName === 'Header'; // Or 'McaTwoHeader' if that's the actual model name in Mongoose.model()

    // GET all documents
    router.get('/', async (req, res) => {
        try {
            const documents = await Model.find();
            if (isStudentModel) {
                // Frontend expects student data wrapped in 'data'
                const formattedDocuments = documents.map(doc => ({ _id: doc._id, data: doc.toObject() }));
                res.json(formattedDocuments);
            } else {
                // Headers and other models are returned directly
                res.json(documents);
            }
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message }); // Added error detail
        }
    });

    // GET a single document by ID (remains generic)
    router.get('/:id', async (req, res) => {
        try {
            const document = await Model.findById(req.params.id);
            if (!document) return res.status(404).json({ message: 'Document not found' });
            res.json(document);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message }); // Added error detail
        }
    });

    // POST a new document
    router.post('/', async (req, res) => {
        let documentData;
        if (isStudentModel) {
            // Student models expect data nested under 'data' key
            documentData = req.body.data;
        } else if (isHeaderModel) {
            // Header model expects 'title' directly in the body
            const { title } = req.body;
            if (!title) return res.status(400).json({ message: "Title is required" });

            const existing = await Model.findOne({ title });
            if (existing) return res.status(409).json({ message: "Header already exists" });

            documentData = { title };
        } else {
            // Generic fallback for other models
            documentData = req.body;
        }

        const newDocument = new Model(documentData);
        try {
            const savedDocument = await newDocument.save();
            if (isStudentModel) {
                // Frontend expects student data wrapped in 'data'
                res.status(201).json({ _id: savedDocument._id, data: savedDocument.toObject() });
            } else {
                // Headers and other models are returned directly
                res.status(201).json(savedDocument);
            }
        } catch (err) {
            res.status(400).json({ message: "Invalid data or server error", error: err.message }); // Added error detail
        }
    });

    // PUT/PATCH (Update) a document by ID
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            let updateData;

            if (isStudentModel) {
                // Student models expect update data nested under 'data' key
                updateData = req.body.data;
            } else if (isHeaderModel) {
                // Header model expects 'title' directly in the body for updates
                const { title } = req.body;
                if (!title) return res.status(400).json({ message: "Title is required" });
                updateData = { title };
            } else {
                // Generic fallback for other models
                updateData = req.body;
            }

            const updatedDocument = await Model.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators` ensures schema validation
            );
            if (!updatedDocument) return res.status(404).json({ message: 'Document not found' });

            if (isStudentModel) {
                // Frontend expects student data wrapped in 'data'
                res.json({ _id: updatedDocument._id, data: updatedDocument.toObject() });
            } else {
                // Headers and other models are returned directly
                res.json(updatedDocument);
            }
        } catch (err) {
            res.status(400).json({ message: 'Failed to update document', error: err.message }); // Added error detail
        }
    });

    // DELETE a document by ID (remains generic)
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const deletedDocument = await Model.findByIdAndDelete(id);

            if (!deletedDocument) return res.status(404).json({ message: 'Document not found' });

            res.json({ message: 'Document deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete document', error: err.message }); // Added error detail
        }
    });

    return router;
};

module.exports = createCrudRouter;