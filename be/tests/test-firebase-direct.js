const admin = require('firebase-admin');
const serviceAccount = require('./PRODUCT KEY/mca-database-3b21c-firebase-adminsdk-fbsvc-4c512d273a.json');

async function testFirebaseConnection() {
  try {
    console.log('🔥 Testing Firebase connection with service account file...');
    console.log('=========================================================');
    
    // Initialize Firebase Admin with service account file
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    
    console.log('✅ Firebase Admin initialized');
    console.log('Project ID:', admin.app().options.projectId);
    
    // Get Firestore instance
    const db = admin.firestore();
    console.log('✅ Firestore instance created');
    
    // Test Firestore connection
    console.log('📡 Testing Firestore connection...');
    
    const testCollection = db.collection('test');
    const timestamp = new Date().toISOString();
    
    // Add a test document
    console.log('📝 Creating test document...');
    const testDoc = await testCollection.add({
      message: 'Firebase connection test',
      timestamp: timestamp
    });
    
    console.log('✅ Test document created with ID:', testDoc.id);
    
    // Read the test document
    console.log('📖 Reading test document...');
    const readDoc = await testDoc.get();
    console.log('✅ Test document read successfully:', readDoc.data());
    
    // Delete the test document
    console.log('🗑️  Deleting test document...');
    await testDoc.delete();
    console.log('✅ Test document deleted successfully');
    
    console.log('');
    console.log('🎉 Firebase connection successful!');
    console.log('Your backend is ready to use Firebase.');
    
  } catch (error) {
    console.error('❌ Firebase connection failed:');
    console.error('Error:', error.message);
    console.log('');
    
    if (error.message.includes('UNAUTHENTICATED')) {
      console.log('💡 This error usually means:');
      console.log('1. Firestore Database is not enabled in your Firebase project');
      console.log('2. Service account permissions are incorrect');
      console.log('');
      console.log('🔧 To fix:');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com/project/mca-database-3b21c/firestore');
      console.log('2. Click "Create database" if not already done');
      console.log('3. Choose "Start in test mode"');
      console.log('4. Select a location');
    }
  }
}

testFirebaseConnection();
