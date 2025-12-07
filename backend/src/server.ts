import 'dotenv/config'; // 1. Load env vars before anything else
import express from "express";
import type { Request, Response } from "express"; // Use 'type' for TS interfaces
import cors from 'cors';
import { connectDatabase } from './config/database.ts';
import authRoutes from "./routes/authRoutes";
// Import Routes
import postsRoutes from "./routes/postsServerEndpoint.ts";
import communityRoutes from './routes/CommunityServerEndpoint.ts';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDatabase();

// API Routes
// This delegates the logic to your separate route files
app.use("/api/auth", authRoutes);
app.use("/apis/Communityapi", communityRoutes);
app.use("/apis/Postapi", postsRoutes);

// Simple Health Check
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});