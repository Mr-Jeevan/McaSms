const firestoreSetup = require('../utils/firestore-setup');
require('dotenv').config();

/**
 * Initialize the Firestore database with sample data
 */
async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');
  console.log('Project:', process.env.FIREBASE_PROJECT_ID);
  
  try {
    // Initialize database with sample data
    const success = await firestoreSetup.initializeDatabase();
    
    if (success) {
      console.log('\n📊 Database Statistics:');
      const stats = await firestoreSetup.getStats();
      
      if (stats) {
        Object.entries(stats).forEach(([collection, count]) => {
          console.log(`  ${collection}: ${count} documents`);
        });
      }
      
      console.log('\n✅ Database initialization completed successfully!');
      console.log('🔗 You can now start the server with: npm run devstart');
    } else {
      console.log('❌ Database initialization failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.log('\n💡 Common issues:');
    console.log('1. Make sure Firestore is enabled in your Firebase console');
    console.log('2. Check your Firebase credentials in the .env file');
    console.log('3. Verify your service account has the necessary permissions');
    console.log('4. Ensure your Firebase project exists and is active');
    process.exit(1);
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
