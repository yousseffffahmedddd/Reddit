import express from "express";
import {
    getOrCreateConversation,
    getUserConversations,
    getMessages,
    sendMessage,
    getAllUsers,
    searchUsers,
} from "../controllers/ChatController";

const router = express.Router();

// User routes
router.get("/users", getAllUsers);
router.get("/users/search", searchUsers);

// Conversation routes
router.post("/conversation", getOrCreateConversation);
router.get("/conversations/:userId", getUserConversations);

// Message routes
router.get("/messages/:conversationId", getMessages);
router.post("/message", sendMessage);

export default router;
