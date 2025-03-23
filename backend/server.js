const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

// Import models
const Note = require("./models/Note");
const Room = require("./models/Room");

// Import routes
const notesRoutes = require("./routes/notesRoutes");
const roomsRoutes = require("./routes/roomsRoutes");

// Setup Express app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }, // In production, restrict this to your frontend URL
    methods: ["GET", "POST"]
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Store active rooms and users in memory for quick access
const activeRooms = {};

// Register routes
app.get("/", (req, res) => res.send("Real-Time Notes Server is Running ✅"));
app.use("/api/notes", notesRoutes);
app.use("/api/rooms", roomsRoutes);

// WebSocket Connection
io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join a specific room
    socket.on("join-room", async ({ roomId, username }) => {
        socket.join(roomId);
        console.log(`👥 User ${username} (${socket.id}) joined room: ${roomId}`);

        // Initialize room if it doesn't exist in memory
        if (!activeRooms[roomId]) {
            activeRooms[roomId] = { 
                users: {},
                content: ''
            };
        }
        
        // Add user to room in memory
        activeRooms[roomId].users[socket.id] = { username, id: socket.id };

        // Update or create room in database
        try {
            await Room.findOneAndUpdate(
                { roomId },
                { 
                    $set: { [`users.${socket.id}`]: { username, id: socket.id } },
                    lastActivity: Date.now()
                },
                { upsert: true }
            );
        } catch (err) {
            console.error('Error updating room in database:', err);
        }

        // Retrieve existing note for the room from database
        try {
            const note = await Note.findOne({ roomId });
            if (note) {
                activeRooms[roomId].content = note.content;
            }
            
            // Send current room state to the newly joined user
            socket.emit("room-state", {
                users: activeRooms[roomId].users,
                content: note ? note.content : ""
            });
            
            // Notify other users that someone joined
            socket.to(roomId).emit("user-joined", { 
                user: { username, id: socket.id } 
            });
        } catch (err) {
            console.error('Error retrieving note from database:', err);
            socket.emit("error", "Failed to load note");
        }
    });

    // Handle note updates
    socket.on("note-update", async ({ roomId, content }) => {
        if (activeRooms[roomId]) {
            // Update content in memory
            activeRooms[roomId].content = content;
            
            // Broadcast to all other users in the room
            socket.to(roomId).emit("content-updated", { content });
            
            // Save to database
            try {
                await Note.findOneAndUpdate(
                    { roomId },
                    { content, updatedAt: Date.now() },
                    { upsert: true, new: true }
                );
            } catch (err) {
                console.error('Error saving note to database:', err);
                socket.emit("error", "Failed to save note");
            }
        }
    });

    // Handle user leaving a room
    socket.on("leave-room", ({ roomId }) => {
        handleUserLeaving(socket, roomId);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
        
        // Find which room(s) the user was in
        for (const roomId in activeRooms) {
            if (activeRooms[roomId].users[socket.id]) {
                handleUserLeaving(socket, roomId);
            }
        }
    });
});

// Helper function for when users leave/disconnect
async function handleUserLeaving(socket, roomId) {
    if (activeRooms[roomId] && activeRooms[roomId].users[socket.id]) {
        const username = activeRooms[roomId].users[socket.id].username;
        
        // Remove user from room in memory
        delete activeRooms[roomId].users[socket.id];
        
        // Remove user from room in database
        try {
            await Room.findOneAndUpdate(
                { roomId },
                { 
                    $unset: { [`users.${socket.id}`]: "" },
                    lastActivity: Date.now()
                }
            );
        } catch (err) {
            console.error('Error updating room in database:', err);
        }
        
        // Notify other users
        io.to(roomId).emit("user-left", { userId: socket.id });
        
        console.log(`👋 User ${username} (${socket.id}) left room: ${roomId}`);
        
        // If room is empty, clean it up from memory
        if (Object.keys(activeRooms[roomId].users).length === 0) {
            delete activeRooms[roomId];
            console.log(`🧹 Room ${roomId} removed from active rooms`);
            // Note: We keep the room and note in the database for persistence
        }
    }
}

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
