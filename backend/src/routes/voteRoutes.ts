// filepath: src/routes/voteRoutes.ts
import express from "express";
import { voteOnPost } from "../controllers/voteController";

const router = express.Router();

// POST /api/votes
router.post("/", voteOnPost);

export default router;