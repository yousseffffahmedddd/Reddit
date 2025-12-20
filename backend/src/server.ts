import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDatabase } from "./config/database"; // Removed .ts extension

import authRoutes from "./routes/authRoutes";
import postsRoutes from "./routes/postsServerEndpoint";
import communityRoutes from "./routes/CommunityServerEndpoint";
import aiRoute from "./routes/aiRoute";
import chatRoutes from "./routes/chatRoute";
import chatbotRoutes from "./routes/chatBotRoutes";
import userRoutes from "./routes/userRoutes";
import voteRoutes from "./routes/voteRoutes";
import commentRoutes from "./routes/commentRoutes";

import { setupSocket } from "./socket";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// DB
connectDatabase();

// REST routes
app.use("/api/auth", authRoutes);
app.use("/apis/Postapi", postsRoutes);
app.use("/apis/Communityapi", communityRoutes);
app.use("/apis/ai", aiRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/users", userRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/comments", commentRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Create HTTP server
const httpServer = createServer(app);

// Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

setupSocket(io);

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});