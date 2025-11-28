import express from "express";
import type { Request, Response } from "express";
import Post from "../models/PostSchema.ts";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, body, userId, communityId } = req.body;

    if (!title || !body || !userId || !communityId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPost = await Post.create({
      title,
      content: body,
      postType: "text",
      author: userId,
      community: communityId,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPopularPosts = async (_req: Request, res: Response) => {
  try {
    const popularPosts = await Post.find()
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(20)
      .populate("author", "username")
      .populate("community", "name");

    res.json(popularPosts);
  } catch (error: any) {
    console.error("Error fetching popular posts:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
