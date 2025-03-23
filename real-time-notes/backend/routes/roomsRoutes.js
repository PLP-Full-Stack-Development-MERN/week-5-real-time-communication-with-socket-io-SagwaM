// routes/rooms.js
const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// Get room by ID
router.get("/:roomId", async (req, res) => {
    try {
        const room = await Room.findOne({ roomId: req.params.roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
