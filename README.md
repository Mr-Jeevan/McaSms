# MCA Student Management System

A full-stack student management platform for MCA departments, enabling efficient student record handling, column customization, and seamless data export.

## 🔧 Features

- 📊 **Student Record Management**: Add, edit, delete student records dynamically.
- 🧩 **Customizable Columns**: Add/remove/rename columns dynamically (stored in MongoDB).
- 📥 **Excel Export**: Export full or filtered student data with selected columns.
- 🔍 **Search**: Real-time filtering across all columns.
- ✍️ **Inline Editing**: Toggle edit mode and modify data directly in the table (Excel-like).
- 🎨 **Responsive UI**: Built with Bootstrap 5 and smooth scroll/fixed headers.
- 🗃️ **REST API Backend**: Node.js/Express with MongoDB for headers and student CRUD operations.

## 🛠 Tech Stack

- **Frontend**: React.js, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Export Utility**: `xlsx` (Excel export)

## 📂 Project Structure

```bash
src/
├── assets/              # Static files (images, banners, etc.)
├── components/          # Reusable UI components (modals, form elements)
├── config/              # Configuration files (e.g. default columns)
├── features/            # Feature-specific logic (if used)
├── GlobalCss/           # Shared/global styles (if applicable)
├── layout/
│   ├── header.css       # Navbar/header styles
│   └── header.jsx       # Navigation header component
├── pages/               # Main views/routes
│   ├── addStudents/     # Add new student page
│   ├── Editpage/        # Edit student page
│   ├── Home/            # Dashboard/homepage
│   ├── LandingPage/     # Landing page (with login CTA)
│   ├── Login/           # Login form
│   ├── Mca_1/           # MCA I class module (optional)
│   └── Mca_2/           # MCA II student management (core module)
├── utils/               # Utility functions (e.g., Excel export)
│   └── ExportToExcel.js
├── App.js               # Root component defining all routes
├── index.js             # Entry point (ReactDOM)
├── tasks.txt            # Task tracking or notes (optional)
├── package.json         # Project dependencies & scripts
└── README.md            # Project documentation

server/
├── models/
│   ├── ColumnHeader.js
│   ├── Student.js
├── routes/
│   ├── headerRoutes.js
│   └── studentRoutes.js
└── server.js
```

## Setup

1. Backend
```
cd be
npm install
node server.js
```

2. Frontend
```
cd fe
npm install
npm start

```
