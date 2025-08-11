const mongoose = require('mongoose');

const columnHeaderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('headers', columnHeaderSchema);
