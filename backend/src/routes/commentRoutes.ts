// filepath: /home/awail/WebstormProjects/Reddit_clone/backend/src/routes/commentRoutes.ts
import express from "express";
import {
    createComment,
    getCommentsByPost,
    getCommentsByPostFlat,
    getCommentById,
    getReplies,
    updateComment,
    deleteComment,
    getCommentCount,
} from "../controllers/commentController";

const router = express.Router();

// Create a new comment
router.post("/", createComment);

// Get all comments for a specific post (nested structure)
router.get("/post/:postId", getCommentsByPost);

// Get all comments for a specific post (flat list)
router.get("/post/:postId/flat", getCommentsByPostFlat);

// Get comment count for a post
router.get("/post/:postId/count", getCommentCount);

// Get a single comment by ID
router.get("/:commentId", getCommentById);

// Get replies to a specific comment
router.get("/:commentId/replies", getReplies);

// Update a comment
router.put("/:commentId", updateComment);

// Delete a comment
router.delete("/:commentId", deleteComment);

export default router;

