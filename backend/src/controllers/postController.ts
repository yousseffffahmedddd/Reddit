import express from "express";
import Post from "../models/PostSchema.ts";

type Request = express.Request;
type Response = express.Response;

// --- 1. CREATE POST (Existing) ---
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
            votes: [] // Ensure your Schema initializes this!
        });

        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 2. GET ALL POSTS (Missing) ---
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        // We utilize .populate() to replace the IDs with actual objects
        // This matches your frontend interface: author: { _id, username }
        const posts = await Post.find()
            .populate("author", "username")
            .populate("community", "name")
            .lean(); // .lean() converts Mongoose docs to plain JS objects for easier editing

        // Calculate score for each post before sending to frontend
        const postsWithScores = posts.map((post: any) => {
            // Calculate sum of votes
            const score = post.votes ? post.votes.reduce((acc: number, vote: any) => acc + vote.value, 0) : 0;

            // Optional: Check if current user voted (requires userId from query or auth)
            // const currentUserId = req.query.userId;
            // const userVote = post.votes.find(v => v.userId === currentUserId)?.value || 0;

            return {
                ...post,
                score,
                userVote: 0 // Defaulting to 0 since fetchPosts currently doesn't send userId
            };
        });

        res.status(200).json(postsWithScores);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 3. VOTE ON POST (Missing) ---
export const votePost = async (req: Request, res: Response) => {
    try {
        const { postId, userId, value } = req.body;

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
            post.votes.push({ userId, value });
        }

        await post.save();

        // Return the new score
        const newScore = post.votes.reduce((acc: number, v: any) => acc + v.value, 0);

        res.status(200).json({ success: true, score: newScore });

    } catch (err) {
        console.error("Vote Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};