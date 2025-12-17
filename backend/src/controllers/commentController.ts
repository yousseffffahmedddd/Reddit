// filepath: /home/awail/WebstormProjects/Reddit_clone/backend/src/controllers/commentController.ts
import express from "express";
import Comment from "../models/CommentSchema.ts";
import Post from "../models/PostSchema.ts";

type Request = express.Request;
type Response = express.Response;

// Create a new comment
export const createComment = async (req: Request, res: Response) => {
    try {
        const { postId, userId, content, parentCommentId } = req.body;

        if (!postId || !userId || !content) {
            return res.status(400).json({ message: "Missing required fields (postId, userId, content)" });
        }

        // Verify that the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // If it's a reply, verify parent comment exists
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

        // Populate the user info before returning
        const populatedComment = await Comment.findById(newComment._id)
            .populate("userId", "username");

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all comments for a post (with nested structure)
export const getCommentsByPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // Get all comments for the post
        const comments = await Comment.find({ postId })
            .populate("userId", "username")
            .sort({ createdAt: -1 });

        // Build nested comment structure
        const commentMap = new Map();
        const rootComments: any[] = [];

        // First pass: create a map of all comments
        comments.forEach((comment: any) => {
            commentMap.set(comment._id.toString(), {
                ...comment.toObject(),
                replies: []
            });
        });

        // Second pass: build the tree structure
        comments.forEach((comment: any) => {
            const commentObj = commentMap.get(comment._id.toString());
            if (comment.parentCommentId) {
                const parent = commentMap.get(comment.parentCommentId.toString());
                if (parent) {
                    parent.replies.push(commentObj);
                }
            } else {
                rootComments.push(commentObj);
            }
        });

        res.json(rootComments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Server error fetching comments" });
    }
};

// Get all comments for a post (flat list)
export const getCommentsByPostFlat = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const comments = await Comment.find({ postId })
            .populate("userId", "username")
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Server error fetching comments" });
    }
};

// Get a single comment by ID
export const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId)
            .populate("userId", "username");

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.json(comment);
    } catch (err) {
        console.error("Error fetching comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get replies to a comment
export const getReplies = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        const replies = await Comment.find({ parentCommentId: commentId })
            .populate("userId", "username")
            .sort({ createdAt: 1 });

        res.json(replies);
    } catch (err) {
        console.error("Error fetching replies:", err);
        res.status(500).json({ message: "Server error fetching replies" });
    }
};

// Update a comment
export const updateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { content, userId } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user is the owner of the comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to update this comment" });
        }

        comment.content = content;
        await comment.save();

        const updatedComment = await Comment.findById(commentId)
            .populate("userId", "username");

        res.json(updatedComment);
    } catch (err) {
        console.error("Error updating comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user is the owner of the comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        // Recursively delete all replies to this comment
        const deleteReplies = async (parentId: string) => {
            const replies = await Comment.find({ parentCommentId: parentId });
            for (const reply of replies) {
                await deleteReplies(reply._id.toString());
                await Comment.findByIdAndDelete(reply._id);
            }
        };

        await deleteReplies(commentId);
        await Comment.findByIdAndDelete(commentId);

        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get comment count for a post
export const getCommentCount = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const count = await Comment.countDocuments({ postId });

        res.json({ count });
    } catch (err) {
        console.error("Error getting comment count:", err);
        res.status(500).json({ message: "Server error" });
    }
};

