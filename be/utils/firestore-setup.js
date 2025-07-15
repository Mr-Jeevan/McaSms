const { db } = require('../config/firebase');

/**
 * Sets up the Firestore database with initial collections and sample data
 */
class FirestoreSetup {
  constructor() {
    this.collections = {
      columnHeaders: 'columnHeaders',
      students: 'students',
      settings: 'settings'
    };
  }

  /**
   * Initialize the database with sample data
   */
  async initializeDatabase() {
    try {
      console.log('🔧 Setting up Firestore database...');
      
      await this.createSampleHeaders();
      await this.createSampleStudents();
      await this.createSettings();
      
      console.log('✅ Database setup completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      return false;
    }
  }

  /**
   * Create sample column headers
   */
  async createSampleHeaders() {
    const sampleHeaders = [
      { title: 'Name', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { title: 'Email', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { title: 'Phone', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { title: 'Course', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { title: 'Year', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];

    for (const header of sampleHeaders) {
      // Check if header already exists
      const existing = await db.collection(this.collections.columnHeaders)
        .where('title', '==', header.title)
        .limit(1)
        .get();
      
      if (existing.empty) {
        await db.collection(this.collections.columnHeaders).add(header);
        console.log(`📝 Created header: ${header.title}`);
      } else {
        console.log(`⚠️  Header already exists: ${header.title}`);
      }
    }
  }

  /**
   * Create sample students
   */
  async createSampleStudents() {
    const sampleStudents = [
      {
        data: {
          Name: 'John Doe',
          Email: 'john.doe@example.com',
          Phone: '+1234567890',
          Course: 'Computer Science',
          Year: '2024'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        data: {
          Name: 'Jane Smith',
          Email: 'jane.smith@example.com',
          Phone: '+1234567891',
          Course: 'Engineering',
          Year: '2024'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        data: {
          Name: 'Bob Johnson',
          Email: 'bob.johnson@example.com',
          Phone: '+1234567892',
          Course: 'Mathematics',
          Year: '2023'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    for (const student of sampleStudents) {
      // Check if student already exists based on email
      const existing = await db.collection(this.collections.students)
        .where('data.Email', '==', student.data.Email)
        .limit(1)
        .get();
      
      if (existing.empty) {
        await db.collection(this.collections.students).add(student);
        console.log(`👨‍🎓 Created student: ${student.data.Name}`);
      } else {
        console.log(`⚠️  Student already exists: ${student.data.Name}`);
      }
    }
  }

  /**
   * Create application settings
   */
  async createSettings() {
    const settings = {
      appName: 'McaSms Backend API',
      version: '1.0.0',
      maxStudents: 1000,
      maxHeaders: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const settingsRef = db.collection(this.collections.settings).doc('app-settings');
    const existingSettings = await settingsRef.get();
    
    if (!existingSettings.exists) {
      await settingsRef.set(settings);
      console.log('⚙️  Created application settings');
    } else {
      console.log('⚠️  Application settings already exist');
    }
  }

  /**
   * Clear all data from collections (use with caution)
   */
  async clearDatabase() {
    try {
      console.log('🗑️  Clearing database...');
      
      const collections = [this.collections.columnHeaders, this.collections.students, this.collections.settings];
      
      for (const collectionName of collections) {
        const snapshot = await db.collection(collectionName).get();
        
        if (!snapshot.empty) {
          const batch = db.batch();
          snapshot.docs.forEach(doc => batch.delete(doc.ref));
          await batch.commit();
          console.log(`🗑️  Cleared collection: ${collectionName}`);
        }
      }
      
      console.log('✅ Database cleared successfully!');
      return true;
    } catch (error) {
      console.error('❌ Database clear failed:', error.message);
      return false;
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      const stats = {};
      
      const collections = [this.collections.columnHeaders, this.collections.students, this.collections.settings];
      
      for (const collectionName of collections) {
        const snapshot = await db.collection(collectionName).get();
        stats[collectionName] = snapshot.size;
      }
      
      return stats;
    } catch (error) {
      console.error('❌ Failed to get stats:', error.message);
      return null;
    }
  }
}

module.exports = new FirestoreSetup();
