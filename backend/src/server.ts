import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.ts';
import dotenv from 'dotenv';
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

dotenv.config()
connectDatabase();

import postsRoutes from "./routes/postsServerEndpoint.ts";
import CommunityServerEndpoint from './routes/CommunityServerEndpoint.ts';


connectDatabase().then(async () => {
  const db = mongoose.connection;

});

app.get("/apis/Communityapi", async (req, res) => {
  try {
    const db = mongoose.connection;
    const communities = await db.collection("Community").find().toArray();
    res.json(communities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch communities" });
  }
});
app.use("/apis/Communityapi", CommunityServerEndpoint);

app.use("/apis/Postapi", postsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});