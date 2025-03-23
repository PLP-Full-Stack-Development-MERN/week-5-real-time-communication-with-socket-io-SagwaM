// Example models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', NoteSchema);