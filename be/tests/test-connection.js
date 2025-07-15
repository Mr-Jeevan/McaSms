const { admin, db } = require('./config/firebase');

async function testConnection() {
  try {
    console.log('🔥 Testing Firebase connection...');
    console.log('================================');
    
    // Test Firebase Admin initialization
    console.log('✅ Firebase Admin initialized');
    console.log('Project ID:', admin.app().options.projectId);
    
    // Test Firestore connection
    console.log('📡 Testing Firestore connection...');
    
    // Try to access Firestore
    const testCollection = db.collection('test');
    const timestamp = new Date().toISOString();
    
    // Add a test document
    const testDoc = await testCollection.add({
      message: 'Firebase connection test',
      timestamp: timestamp
    });
    
    console.log('✅ Test document created with ID:', testDoc.id);
    
    // Read the test document
    const readDoc = await testDoc.get();
    console.log('✅ Test document read successfully:', readDoc.data());
    
    // Delete the test document
    await testDoc.delete();
    console.log('✅ Test document deleted successfully');
    
    console.log('');
    console.log('🎉 Firebase connection successful!');
    console.log('Your backend is ready to use Firebase.');
    
  } catch (error) {
    console.error('❌ Firebase connection failed:');
    console.error('Error:', error.message);
    console.log('');
    console.log('💡 Make sure you have:');
    console.log('1. Created a Firebase project');
    console.log('2. Enabled Firestore database');
    console.log('3. Generated service account key');
    console.log('4. Created .env file with correct values');
    console.log('');
    console.log('Run "npm run setup" for detailed instructions');
  }
}

testConnection();
