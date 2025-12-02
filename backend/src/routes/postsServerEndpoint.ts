// // src/routes/posts.ts
// import express from "express";
// import { createPost } from "../controllers/postController.ts";
// import Post from "../models/PostSchema.ts";
// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const { title, content, community, postType } = req.body;

//     if (!title || !content || !community || !postType) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const newPost = await Post.create({ title, content, community, postType });

//     res.status(201).json(newPost);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// export default router;

// src/routes/posts.ts
import express from "express";
import type { Request, Response } from "express"; // Use 'type' for TS interfaces
import Post from "../models/PostSchema.ts";

const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { title, content, postType, author, community } = req.body;

    // Validate required fields
    if (!title || !content || !postType || !author || !community) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create the post in DB
    const newPost = await Post.create({
      title,
      content,
      postType,
      author,     // must be a valid ObjectId of a user
      community,  // must be a valid ObjectId of a community
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//get all posts and put posts created in main page
// GET all posts
router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    // Fetch posts and populate author & community
    const posts = await Post.find()
    //   .populate("author", "username")         // adjust field names
    //   .populate("community", "name")
      .sort({ createdAt: -1 });               // newest first

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
});

export default router;
