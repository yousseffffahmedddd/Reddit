// filepath: /home/awail/WebstormProjects/Reddit_clone/backend/src/routes/commentRoutes.ts
import express from "express";
import {
    createComment,
    getCommentsByPostId,
    getCommentById,
    updateComment,
    deleteComment,
    getCommentCount,
    getUserComments,
} from "../controllers/commentController.ts";

const router = express.Router();

// Create a new comment
router.post("/", createComment);

// Get all comments for a specific post (with nested replies)
router.get("/post/:postId", getCommentsByPostId);

// Get comment count for a post
router.get("/post/:postId/count", getCommentCount);

// Get a single comment by ID
router.get("/:commentId", getCommentById);

// Update a comment
router.put("/:commentId", updateComment);

// Delete a comment
router.delete("/:commentId", deleteComment);

// Get all comments by a user
router.get("/user/:userId", getUserComments);

export default router;

