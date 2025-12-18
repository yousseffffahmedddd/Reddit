// filepath: src/controllers/voteController.ts
import { Request, Response } from "express";
import Vote from "../models/VoteSchema";
import Post from "../models/PostSchema";

export const voteOnPost = async (req: Request, res: Response) => {
    try {
        const { postId, userId, value } = req.body; // value should be 1 (upvote) or -1 (downvote)

        if (![1, -1].includes(value)) {
            return res.status(400).json({ message: "Vote value must be 1 or -1" });
        }

        // 1. Check if user already voted on this post
        const existingVote = await Vote.findOne({ userId: userId, postId: postId });
        let scoreChange = 0;

        if (!existingVote) {
            // SCENARIO A: New Vote
            const newVote = new Vote({ userId: userId, postId: postId, value });
            await newVote.save();
            scoreChange = value;
        } else if (existingVote.value === value) {
            // SCENARIO B: Toggle Off (User clicked same button again)
            await existingVote.deleteOne();
            scoreChange = -value; // Reverse the score
        } else {
            // SCENARIO C: Switch Vote (e.g., Upvote -> Downvote)
            existingVote.value = value;
            await existingVote.save();
            scoreChange = 2 * value; // Jump by 2 (e.g., -1 to +1 is +2)
        }

        // 2. Update the Post's total score
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: { score: scoreChange } }, // Atomic increment
            { new: true }
        );

        res.status(200).json({
            success: true,
            score: updatedPost?.score,
            userVote: existingVote && existingVote.value === value ? 0 : value
        });

    } catch (error) {
        console.error("Vote Error:", error);
        res.status(500).json({ message: "Failed to vote" });
    }
};