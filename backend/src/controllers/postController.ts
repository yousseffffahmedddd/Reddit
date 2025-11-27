// src/controllers/postController.ts
import express from "express";
import Post from "../models/PostSchema.ts";

type Request = express.Request;
type Response = express.Response;
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, body, userId, communityId } = req.body;

    if (!title || !body || !userId || !communityId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPost = await Post.create({
      title,
      content: body,
      postType: "text", // Assuming a default postType; adjust as needed
      author: userId,
      community: communityId,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
