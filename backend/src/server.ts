import 'dotenv/config';
import express from "express";
import cors from 'cors';
import { connectDatabase } from './config/database.ts';

import authRoutes from "./routes/authRoutes.ts";
import postsRoutes from "./routes/postsServerEndpoint.ts";
import communityRoutes from './routes/CommunityServerEndpoint.ts';
import aiRoute from "./routes/aiRoute.ts";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDatabase();

// Routes
app.use("/api/auth", authRoutes);
app.use("/apis/Communityapi", communityRoutes);
app.use("/apis/Postapi", postsRoutes);
app.use("/apis/ai", aiRoute);


app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
