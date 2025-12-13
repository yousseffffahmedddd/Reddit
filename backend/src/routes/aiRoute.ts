import express from "express";
import { summarizePost } from "../controllers/aiController";

const router = express.Router();


router.post("/summarize", summarizePost);

export default router;
