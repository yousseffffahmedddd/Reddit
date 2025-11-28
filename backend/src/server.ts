import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.ts";

import postsRoutes from "./routes/postsServerEndpoint.ts";
import CommunityServerEndpoint from "./routes/CommunityServerEndpoint.ts";
import userRoutes from "./routes/userRoutes.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Routes
app.use("/apis/Communityapi", CommunityServerEndpoint);
app.use("/apis/Postapi", postsRoutes);

app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/communities", CommunityServerEndpoint);
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
