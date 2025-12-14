import express from "express";
import { summarizePost } from "../controllers/ai_sumController.ts";

const router = express.Router();


router.post("/summarize", summarizePost);

export default router;
