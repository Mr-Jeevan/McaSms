const express = require('express');
const mongoose = require('mongoose');


const app = express();

const conn = mongoose.connect('mongodb://localhost:27017/srms').then(() => { console.log("MongoDB connected successfully") }).catch(err => { console.error("MongoDB connection error:", err) });
const port = 3000;

