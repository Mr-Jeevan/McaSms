# Firebase Setup Instructions

## Prerequisites
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database in your Firebase project
3. Generate a service account key

## Steps to Configure Firebase

### 1. Create Firebase Project
- Go to https://console.firebase.google.com/
- Click "Create a project"
- Follow the setup wizard

### 2. Enable Firestore Database
- In your Firebase project console, go to "Firestore Database"
- Click "Create database"
- Choose "Start in test mode" (you can change security rules later)
- Select a location for your database

### 3. Generate Service Account Key
- Go to Project Settings (click the gear icon)
- Go to "Service accounts" tab
- Click "Generate new private key"
- Save the downloaded JSON file securely

### 4. Update Firebase Configuration
- Open `config/firebase.js`
- Replace the placeholder values with your actual Firebase credentials from the downloaded JSON file:

```javascript
const serviceAccount = {
  "type": "service_account",
  "project_id": "your-actual-project-id",
  "private_key_id": "your-actual-private-key-id",
  "private_key": "your-actual-private-key",
  "client_email": "your-actual-client-email",
  "client_id": "your-actual-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-actual-client-cert-url"
};
```

### 5. Alternative: Use Environment Variables (Recommended)
For better security, you can store credentials in environment variables:

Create a `.env` file in your project root:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=your-client-cert-url
```

Then update `config/firebase.js`:
```javascript
require('dotenv').config();

const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
};
```

### 6. Install dotenv (if using environment variables)
```bash
npm install dotenv
```

## Database Structure

Your Firebase Firestore will have two collections:

### Students Collection
- Collection name: `students`
- Document structure:
```javascript
{
  id: "auto-generated-id",
  data: {
    // Dynamic key-value pairs based on column headers
    "Student Name": "John Doe",
    "Age": "20",
    "Email": "john@example.com"
  },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Column Headers Collection
- Collection name: `columnHeaders`
- Document structure:
```javascript
{
  id: "auto-generated-id",
  title: "Student Name",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Security Rules (Optional)
You can set up Firestore security rules to control access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Allow all for development
    }
  }
}
```

## Running the Application
1. Make sure you've configured Firebase credentials
2. Run `npm run devstart` to start the development server
3. The API will be available at `http://localhost:3001`

## API Endpoints
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

- `GET /api/headers` - Get all column headers
- `POST /api/headers` - Create new column header
- `PUT /api/headers/:id` - Update column header
- `DELETE /api/headers/:id` - Delete column header
