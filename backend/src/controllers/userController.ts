import type { Request, Response } from "express";
import User from "../models/UserSchema.ts";
import Post from "../models/PostSchema.ts";

export const getUserById = async (req: Request, res: Response) => {
    try {
        console.log("Fetching user with ID:", req.params.id); // Debug log
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            console.log("User not found in database"); // Debug log
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found:", user.username); // Debug log
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error); // Better error logging
        res.status(500).json({ message: "Server error", error: String(error) });
    }
};

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find({ author: req.params.id })
            .sort({ createdAt: -1 })
            .populate("author", "username _id")  // ✅ Added _id
            .populate("community", "name");

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};