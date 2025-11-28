// backend/src/routes/postsServerEndpoint.ts

import express from "express";
import type { Request, Response } from "express";
import Post from "../models/PostSchema.ts";

const router = express.Router();

// ===== Create Post =====
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, content, postType, author, community } = req.body;

    if (!title || !content || !postType || !author || !community) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPost = await Post.create({
      title,
      content,
      postType,
      author,
      community,
      upvotes: 0,
      comments: [],
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== Get All Posts =====
router.get("/", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("author", "username _id")  // ✅ Added _id
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
});

// ===== Popular Posts =====
router.get("/popular", async (req: Request, res: Response) => {
  try {
    const popularPosts = await Post.find()
      .populate("author", "username _id")  // ✅ Added _id
      .populate("community", "name")
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(20);

    res.json(popularPosts);
  } catch (err) {
    console.error("Error fetching popular posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;