# McaSms Backend API

A comprehensive Node.js backend API for the McaSms application using Firebase Firestore as the database. This API provides endpoints for managing student data and dynamic column headers with a robust, scalable architecture.

## 🚀 Features

- **RESTful API** with standardized responses
- **Firebase Firestore** integration
- **Dynamic column headers** management
- **Student data management** with flexible schema
- **Error handling** and validation
- **Database initialization** with sample data
- **Comprehensive testing** utilities
- **CORS support** for frontend integration

## 📁 Project Structure

```
be/
├── config/
│   └── firebase.js              # Firebase configuration
├── routes/
│   ├── headerRoutes.js          # Column header routes
│   └── studentRoutes.js         # Student data routes
├── services/
│   ├── headerService.js         # Header business logic
│   └── studentService.js        # Student business logic
├── utils/
│   ├── firestore-setup.js       # Database setup utility
│   ├── api-response.js          # Standardized API responses
│   └── validation.js            # Input validation utility
├── middleware/
│   └── error-handler.js         # Error handling middleware
├── scripts/
│   ├── init-database.js         # Database initialization script
│   ├── setup-firebase.js        # Firebase setup script
│   └── organize-project.js      # Project organization script
├── tests/
│   ├── test-connection.js       # Firebase connection test
│   └── test-firebase-direct.js  # Direct Firebase test
├── docs/
│   ├── PROJECT_STATUS.md        # Project status documentation
│   └── FIREBASE_SETUP.md        # Firebase setup guide
├── PRODUCT KEY/
│   └── mca-database-3b21c-firebase-adminsdk-fbsvc-4c512d273a.json
├── .env                         # Environment variables
├── .env.example                # Environment template
├── server.js                   # Main server file
├── package.json                # Dependencies and scripts
└── README.md                  # This file
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Configuration
The Firebase credentials are already configured in `.env` file from the service account JSON:
- Project ID: `mca-database-3b21c`
- All necessary credentials are properly set up

### 3. Enable Firestore Database
**IMPORTANT**: You need to enable Firestore in your Firebase console:
1. Go to [Firebase Console](https://console.firebase.google.com/project/mca-database-3b21c/firestore)
2. Click "Create database"
3. Choose "Start in test mode"
4. Select a location (preferably close to your users)

### 4. Initialize Database
```bash
npm run init-db
```
This will create sample data including:
- Column headers (Name, Email, Phone, Course, Year)
- Sample students
- Application settings

### 5. Start the Server
```bash
# Development with auto-restart
npm run devstart

# Production
npm start
```

The server will run on `http://localhost:3001`

## 🔌 API Endpoints

### Headers API (`/api/headers`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/headers` | Get all column headers |
| POST | `/api/headers` | Create new header |
| PUT | `/api/headers/:id` | Update header |
| DELETE | `/api/headers/:id` | Delete header |

**Example Request (POST /api/headers):**
```json
{
  "title": "Address"
}
```

### Students API (`/api/students`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

**Example Request (POST /api/students):**
```json
{
  "data": {
    "Name": "John Doe",
    "Email": "john@example.com",
    "Phone": "+1234567890",
    "Course": "Computer Science",
    "Year": "2024"
  }
}
```

### Response Format
All API responses follow a standardized format:
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Start production server |
| Development | `npm run devstart` | Start development server with auto-restart |
| Setup | `npm run setup` | Firebase setup instructions |
| Test Connection | `npm run test-connection` | Test Firebase connection |
| Test Firebase | `npm run test-firebase` | Direct Firebase test |
| Initialize DB | `npm run init-db` | Initialize database with sample data |
| Organize | `npm run organize` | Organize project structure and cleanup |

## 🔐 Environment Variables

The following environment variables are configured in `.env`:

```env
FIREBASE_PROJECT_ID=mca-database-3b21c
FIREBASE_PRIVATE_KEY_ID=4c512d273a8eb75e1aa1c48b792865b8a8bc5047
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mca-database-3b21c.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=111299334754633793466
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mca-database-3b21c.iam.gserviceaccount.com
```

## 🧪 Testing

### Test Firebase Connection
```bash
npm run test-connection
```

### Test Direct Firebase Access
```bash
npm run test-firebase
```

### Database Statistics
After running `npm run init-db`, you'll see:
- Number of documents in each collection
- Initialization status
- Any errors encountered

## 🔍 Troubleshooting

### Common Issues

1. **UNAUTHENTICATED Error**
   - Make sure Firestore is enabled in Firebase Console
   - Check that your service account has proper permissions

2. **Connection Issues**
   - Verify Firebase project exists and is active
   - Check internet connectivity
   - Ensure credentials are correct

3. **Database Not Found**
   - Enable Firestore in Firebase Console
   - Make sure you've selected the correct project

### Getting Help
1. Check the Firebase Console for your project status
2. Review the error logs in the console
3. Verify your environment variables are set correctly
4. Run the test scripts to diagnose connection issues

## 📚 Database Schema

### Collections

#### `columnHeaders`
```json
{
  "id": "auto-generated",
  "title": "Column Title",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### `students`
```json
{
  "id": "auto-generated",
  "data": {
    "Name": "Student Name",
    "Email": "student@example.com",
    "Phone": "+1234567890",
    "Course": "Course Name",
    "Year": "2024"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### `settings`
```json
{
  "id": "app-settings",
  "appName": "McaSms Backend API",
  "version": "1.0.0",
  "maxStudents": 1000,
  "maxHeaders": 50,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## 🚀 Deployment

For production deployment:
1. Set `NODE_ENV=production` in your environment
2. Ensure all environment variables are properly configured
3. Run `npm start` instead of `npm run devstart`
4. Configure your firewall to allow traffic on port 3001

## 🤝 Frontend Integration

The API is configured with CORS to allow frontend connections. The frontend should connect to:
- Development: `http://localhost:3001`
- Production: Your deployed server URL

## 📄 License

ISC License - See package.json for details

## 📞 Support

For issues or questions:
1. Check this README for common solutions
2. Review Firebase Console for project status
3. Test connections using provided scripts
4. Check server logs for detailed error messages
