// src/routes/posts.ts
import express from "express";
import { createPost, getAllPosts, votePost, getPostById, updatePost, deletePost } from "../controllers/postController";
import { uploadPostImage } from "../middleware/upload";

const router = express.Router();

// Upload post image
router.post("/upload", uploadPostImage.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        const imageUrl = `/uploads/posts/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Upload failed" });
    }
});

// Create a new post
router.post("/", createPost);

// GET all posts
router.get("/", getAllPosts);

// GET post by ID
router.get("/:postId", getPostById);

// Update a post
router.put("/:postId", updatePost);

// Delete a post
router.delete("/:postId", deletePost);

// Vote on a post
router.post("/vote", votePost);

export default router;
