// filepath: /home/awail/WebstormProjects/Reddit_clone/backend/src/controllers/commentController.ts
import express from "express";
import mongoose from "mongoose";
import Comment from "../models/CommentSchema";
import Post from "../models/PostSchema";

type Request = express.Request;
type Response = express.Response;

// --- 1. CREATE COMMENT ---
export const createComment = async (req: Request, res: Response) => {
    try {
        const { postId, userId, content, parentCommentId } = req.body;

        if (!postId || !userId || !content) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Verify the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // If parentCommentId is provided, verify it exists
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ message: "Parent comment not found" });
            }
        }

        const newComment = await Comment.create({
            postId,
            userId,
            content,
            parentCommentId: parentCommentId || null,
        });

        // Populate user info before sending response
        const populatedComment = await Comment.findById(newComment._id)
            .populate("userId", "username profilePicture")
            .lean();

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 2. GET COMMENTS BY POST ID ---
export const getCommentsByPostId = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { userId } = req.query; // Optional: current user ID to check their votes

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // Fetch all comments for this post
        const comments = await Comment.find({ postId })
            .populate("userId", "username profilePicture")
            .sort({ createdAt: -1 })
            .lean();

        // Calculate scores for each comment
        const commentsWithScores = comments.map((comment: any) => {
            const score = comment.votes ? comment.votes.reduce((acc: number, vote: any) => acc + vote.value, 0) : 0;
            const upvotes = comment.votes ? comment.votes.filter((v: any) => v.value === 1).length : 0;
            const downvotes = comment.votes ? comment.votes.filter((v: any) => v.value === -1).length : 0;

            // Check if current user has voted on this comment
            let userVote = 0;
            if (userId && comment.votes) {
                const userVoteObj = comment.votes.find((v: any) => v.userId.toString() === userId);
                if (userVoteObj) {
                    userVote = userVoteObj.value;
                }
            }

            return {
                ...comment,
                score,
                upvotes,
                downvotes,
                userVote,
            };
        });

        // Organize comments into a tree structure (parent comments with nested replies)
        const commentMap = new Map();
        const rootComments: any[] = [];

        // First pass: Create a map of all comments
        commentsWithScores.forEach((comment: any) => {
            commentMap.set(comment._id.toString(), { ...comment, replies: [] });
        });

        // Second pass: Build the tree structure
        commentsWithScores.forEach((comment: any) => {
            const commentWithReplies = commentMap.get(comment._id.toString());
            if (comment.parentCommentId) {
                const parent = commentMap.get(comment.parentCommentId.toString());
                if (parent) {
                    parent.replies.push(commentWithReplies);
                } else {
                    // Parent not found, treat as root comment
                    rootComments.push(commentWithReplies);
                }
            } else {
                rootComments.push(commentWithReplies);
            }
        });

        res.status(200).json(rootComments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 3. GET SINGLE COMMENT BY ID ---
export const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId)
            .populate("userId", "username profilePicture")
            .lean();

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json(comment);
    } catch (err) {
        console.error("Error fetching comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 4. UPDATE COMMENT ---
export const updateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { userId, content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user owns this comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this comment" });
        }

        comment.content = content;
        await comment.save();

        const updatedComment = await Comment.findById(commentId)
            .populate("userId", "username profilePicture")
            .lean();

        res.status(200).json(updatedComment);
    } catch (err) {
        console.error("Error updating comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 5. DELETE COMMENT ---
export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user owns this comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        // Delete all replies to this comment (recursive deletion)
        await deleteCommentAndReplies(commentId);

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Helper function to recursively delete comments and their replies
const deleteCommentAndReplies = async (commentId: string) => {
    // Find all replies to this comment
    const replies = await Comment.find({ parentCommentId: commentId });

    // Recursively delete each reply
    for (const reply of replies) {
        await deleteCommentAndReplies(reply._id.toString());
    }

    // Delete the comment itself
    await Comment.findByIdAndDelete(commentId);
};

// --- 6. GET COMMENT COUNT FOR A POST ---
export const getCommentCount = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const count = await Comment.countDocuments({ postId });

        res.status(200).json({ count });
    } catch (err) {
        console.error("Error getting comment count:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 7. GET USER'S COMMENTS ---
export const getUserComments = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const comments = await Comment.find({ userId })
            .populate("postId", "title")
            .populate("userId", "username profilePicture")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(comments);
    } catch (err) {
        console.error("Error fetching user comments:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 8. VOTE ON COMMENT ---
export const voteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { userId, value } = req.body;

        if (![1, -1, 0].includes(value)) {
            return res.status(400).json({ message: "Vote value must be 1, -1, or 0" });
        }

        // Find comment
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Check if user already voted
        const existingVoteIndex = comment.votes.findIndex((v: any) => v.userId.toString() === userId);

        if (value === 0) {
            // Remove vote if exists
            if (existingVoteIndex !== -1) {
                comment.votes.splice(existingVoteIndex, 1);
            }
        } else if (existingVoteIndex !== -1) {
            // User already voted
            const existingVote = comment.votes[existingVoteIndex];

            if (existingVote.value === value) {
                // Toggling off (removing vote)
                comment.votes.splice(existingVoteIndex, 1);
            } else {
                // Changing vote (e.g., up to down)
                comment.votes[existingVoteIndex].value = value;
            }
        } else {
            // New vote
            comment.votes.push({ userId: new mongoose.Types.ObjectId(userId), value });
        }

        await comment.save();

        // Return the new vote counts
        const newScore = comment.votes.reduce((acc: number, v: any) => acc + v.value, 0);
        const upvotes = comment.votes.filter((v: any) => v.value === 1).length;
        const downvotes = comment.votes.filter((v: any) => v.value === -1).length;

        // Get user's current vote
        const userVoteObj = comment.votes.find((v: any) => v.userId.toString() === userId);
        const userVote = userVoteObj ? userVoteObj.value : 0;

        res.status(200).json({ success: true, score: newScore, upvotes, downvotes, userVote });

    } catch (err) {
        console.error("Comment Vote Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

