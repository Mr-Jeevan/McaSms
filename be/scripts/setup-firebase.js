const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Helper');
console.log('========================');
console.log('');

console.log('Step 1: Create Firebase Project');
console.log('-------------------------------');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Click "Create a project"');
console.log('3. Enter project name (e.g., "student-management-system")');
console.log('4. Continue through the setup wizard');
console.log('');

console.log('Step 2: Enable Firestore Database');
console.log('----------------------------------');
console.log('1. In your Firebase project console, click "Firestore Database"');
console.log('2. Click "Create database"');
console.log('3. Choose "Start in test mode"');
console.log('4. Select a location (choose closest to your users)');
console.log('');

console.log('Step 3: Generate Service Account Key');
console.log('------------------------------------');
console.log('1. In Firebase console, click the gear icon (Project Settings)');
console.log('2. Go to "Service accounts" tab');
console.log('3. Click "Generate new private key"');
console.log('4. Save the downloaded JSON file');
console.log('');

console.log('Step 4: Configure Environment Variables');
console.log('---------------------------------------');
console.log('1. Open the downloaded JSON file');
console.log('2. Copy the values to create a .env file in your project root');
console.log('3. Use the template below:');
console.log('');

const envTemplate = `# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id-from-json
FIREBASE_PRIVATE_KEY_ID=your-private-key-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_FROM_JSON\\n-----END PRIVATE KEY-----\\n"
FIREBASE_CLIENT_EMAIL=your-client-email-from-json
FIREBASE_CLIENT_ID=your-client-id-from-json
FIREBASE_CLIENT_CERT_URL=your-client-cert-url-from-json`;

console.log(envTemplate);
console.log('');

console.log('Step 5: Test Connection');
console.log('-----------------------');
console.log('After creating your .env file, run:');
console.log('npm run devstart');
console.log('');

console.log('💡 Tips:');
console.log('- Keep your service account JSON file secure');
console.log('- Add .env to your .gitignore file');
console.log('- The private key should include \\n for line breaks');
console.log('');

// Check if .env file exists
if (fs.existsSync('.env')) {
  console.log('✅ .env file found');
} else {
  console.log('❌ .env file not found - you need to create it');
}

// Check if .gitignore exists and includes .env
let gitignoreContent = '';
if (fs.existsSync('.gitignore')) {
  gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  if (gitignoreContent.includes('.env')) {
    console.log('✅ .env is in .gitignore');
  } else {
    console.log('⚠️  Add .env to your .gitignore file');
  }
} else {
  console.log('⚠️  Create .gitignore file and add .env to it');
}

console.log('');
console.log('For detailed instructions, see FIREBASE_SETUP.md');
