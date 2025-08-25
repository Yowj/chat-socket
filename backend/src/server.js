import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/route.auth.js";
import usersRoutes from "./routes/route.user.js";
import messagesRoutes from "./routes/route.message.js";

const app = express();
const server = http.createServer(app);

// CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", usersRoutes)
app.use("/api/message", messagesRoutes);


// Store online users
const onlineUsers = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle user joining
  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Broadcast updated online users list
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log(`User ${userId} is online. Total online: ${onlineUsers.size}`);
  });

  // Handle real-time message sending
  socket.on("send-message", (data) => {
    const { receiverId, message, senderId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", {
        _id: new Date().getTime(),
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        createdAt: new Date(),
      });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      // Broadcast updated online users list
      io.emit("online-users", Array.from(onlineUsers.keys()));
      console.log(`User ${socket.userId} disconnected. Total online: ${onlineUsers.size}`);
    }
  });
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port http://localhost:${PORT}`);
});
