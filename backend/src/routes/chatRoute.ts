import express from "express";
import {
    getOrCreateConversation,
    getMessages,
} from "../controllers/ChatController";

const router = express.Router();

// Create or fetch a conversation
router.post("/conversation", getOrCreateConversation);

// Get messages for a conversation
router.get("/messages/:conversationId", getMessages);

export default router;
