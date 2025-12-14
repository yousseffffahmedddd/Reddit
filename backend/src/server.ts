import 'dotenv/config';
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDatabase } from "./config/database.ts";

import authRoutes from "./routes/authRoutes";
import postsRoutes from "./routes/postsServerEndpoint.ts";
import communityRoutes from "./routes/CommunityServerEndpoint.ts";
import aiRoute from "./routes/aiRoute.ts";
import chatRoutes from "./routes/chatRoute";

import { setupSocket } from "./socket";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// DB
connectDatabase();

// REST routes
app.use("/api/auth", authRoutes);
app.use("/apis/Postapi", postsRoutes);
app.use("/apis/Communityapi", communityRoutes);
app.use("/apis/ai", aiRoute);
app.use("/apis/chat", chatRoutes);

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
