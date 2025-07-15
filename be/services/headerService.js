const { db } = require('../config/firebase');

const COLLECTION_NAME = 'columnHeaders';

class HeaderService {
  // Get all headers
  async getAllHeaders() {
    try {
      const snapshot = await db.collection(COLLECTION_NAME)
        .orderBy('createdAt', 'asc')
        .get();
      
      const headers = [];
      snapshot.forEach(doc => {
        headers.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return headers;
    } catch (error) {
      throw new Error(`Error fetching headers: ${error.message}`);
    }
  }

  // Get header by title (for checking duplicates)
  async getHeaderByTitle(title) {
    try {
      const snapshot = await db.collection(COLLECTION_NAME)
        .where('title', '==', title)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error fetching header by title: ${error.message}`);
    }
  }

  // Get header by ID
  async getHeaderById(id) {
    try {
      const doc = await db.collection(COLLECTION_NAME).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error fetching header: ${error.message}`);
    }
  }

  // Create new header
  async createHeader(title) {
    try {
      // Check if header already exists
      const existing = await this.getHeaderByTitle(title);
      if (existing) {
        throw new Error('Header already exists');
      }

      const timestamp = new Date().toISOString();
      const newHeader = {
        title: title.trim(),
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const docRef = await db.collection(COLLECTION_NAME).add(newHeader);
      
      // Get the created document
      const createdDoc = await docRef.get();
      return {
        id: createdDoc.id,
        ...createdDoc.data()
      };
    } catch (error) {
      throw new Error(`Error creating header: ${error.message}`);
    }
  }

  // Update header
  async updateHeader(id, title) {
    try {
      const timestamp = new Date().toISOString();
      const updateData = {
        title: title.trim(),
        updatedAt: timestamp
      };

      const docRef = db.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      await docRef.update(updateData);
      
      // Get the updated document
      const updatedDoc = await docRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      throw new Error(`Error updating header: ${error.message}`);
    }
  }

  // Delete header
  async deleteHeader(id) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      await docRef.delete();
      return { id, message: 'Header deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting header: ${error.message}`);
    }
  }
}

module.exports = new HeaderService();
