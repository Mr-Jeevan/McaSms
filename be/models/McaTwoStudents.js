  const mongoose = require('mongoose');

  const studentSchema = new mongoose.Schema(
    {
      data: {
        type: Map,
        of: String // you can also use 'Mixed' if you want to store any type
      }
    },
    { timestamps: true }
  );

  module.exports = mongoose.model('McaTwoStudents', studentSchema);
