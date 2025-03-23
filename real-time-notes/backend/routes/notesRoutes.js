// routes/notes.js
const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Get note by room ID
router.get("/room/:roomId", async (req, res) => {
    try {
        const note = await Note.findOne({ roomId: req.params.roomId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create or update note
router.post("/room/:roomId", async (req, res) => {
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { roomId: req.params.roomId },
            { content: req.body.content, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.status(201).json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
