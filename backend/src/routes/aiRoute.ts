import express from "express";
import { summarizePost } from "../controllers/ai_sumController";

const router = express.Router();


router.post("/summarize", summarizePost);

export default router;
