import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/signuplogin_page"
  )
  .then(() => console.log("MongoDB connected for SignupLogin-Page"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`SignupLogin-Page backend running on http://localhost:${PORT}`);
});
