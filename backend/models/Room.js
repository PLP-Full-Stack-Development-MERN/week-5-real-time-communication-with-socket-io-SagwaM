//  models/Room.js
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  users: {
    type: Map,
    of: {
      username: String,
      id: String
    },
    default: {}
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', RoomSchema);
