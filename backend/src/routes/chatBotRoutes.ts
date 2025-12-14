import express from "express";
import { askChatbot } from "../controllers/chatBotController";

const router = express.Router();

router.post("/ask", askChatbot);

export default router;
