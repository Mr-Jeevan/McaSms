const { db } = require('../config/firebase');

const COLLECTION_NAME = 'students';

class StudentService {
  // Get all students
  async getAllStudents() {
    try {
      const snapshot = await db.collection(COLLECTION_NAME).get();
      const students = [];
      snapshot.forEach(doc => {
        students.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return students;
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}`);
    }
  }

  // Get student by ID
  async getStudentById(id) {
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
      throw new Error(`Error fetching student: ${error.message}`);
    }
  }

  // Create new student
  async createStudent(studentData) {
    try {
      const timestamp = new Date().toISOString();
      const newStudent = {
        data: studentData.data || {},
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const docRef = await db.collection(COLLECTION_NAME).add(newStudent);
      
      // Get the created document
      const createdDoc = await docRef.get();
      return {
        id: createdDoc.id,
        ...createdDoc.data()
      };
    } catch (error) {
      throw new Error(`Error creating student: ${error.message}`);
    }
  }

  // Update student
  async updateStudent(id, studentData) {
    try {
      const timestamp = new Date().toISOString();
      const updateData = {
        data: studentData.data || {},
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
      throw new Error(`Error updating student: ${error.message}`);
    }
  }

  // Delete student
  async deleteStudent(id) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      await docRef.delete();
      return { id, message: 'Student deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting student: ${error.message}`);
    }
  }
}

module.exports = new StudentService();
