// filepath: src/controllers/voteController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/PostSchema";

export const voteOnPost = async (req: Request, res: Response) => {
    try {
        const { postId, userId, value } = req.body; // value should be 1 (upvote) or -1 (downvote)

        if (![1, -1].includes(value)) {
            return res.status(400).json({ message: "Vote value must be 1 or -1" });
        }

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Find post
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if user already voted
        const existingVoteIndex = post.votes.findIndex((v: any) => v.userId.toString() === userId);

        if (existingVoteIndex !== -1) {
            // User already voted
            const existingVote = post.votes[existingVoteIndex];

            if (existingVote.value === value) {
                // Toggling off (removing vote)
                post.votes.splice(existingVoteIndex, 1);
            } else {
                // Changing vote (e.g., up to down)
                post.votes[existingVoteIndex].value = value;
            }
        } else {
            // New vote
            post.votes.push({ userId: new mongoose.Types.ObjectId(userId), value });
        }

        await post.save();

        // Return the new score
        const newScore = post.votes.reduce((acc: number, v: any) => acc + v.value, 0);

        res.status(200).json({ success: true, score: newScore });

    } catch (error) {
        console.error("Vote Error:", error);
        res.status(500).json({ message: "Failed to vote" });
    }
};