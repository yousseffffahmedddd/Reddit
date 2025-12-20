import { Request, Response } from "express";
import Conversation from "../models/ConversationSchema";
import Message from "../models/MessageSchema";
import User from "../models/UserSchema";

// Create or get a conversation
export const getOrCreateConversation = async (req: Request, res: Response) => {
    try {
        const { userId, otherUserId } = req.body;

        if (!userId || !otherUserId) {
            return res.status(400).json({ message: "Missing user IDs" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId],
            $size:2},
        }).populate("participants", "username avatarUrl");

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [userId, otherUserId],
            });
            conversation = await conversation.populate("participants", "username avatarUrl");
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create conversation" });
    }
};

// Get all conversations for a user
export const getUserConversations = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "Missing user ID" });
        }

        const conversations = await Conversation.find({
            participants: userId,
        })
            .populate("participants", "username avatarUrl")
            .sort({ updatedAt: -1 });

        // Get last message for each conversation
        const conversationsWithLastMessage = await Promise.all(
            conversations.map(async (conv) => {
                const lastMessage = await Message.findOne({
                    conversationId: conv._id,
                })
                    .sort({ createdAt: -1 })
                    .populate("sender", "username");

                return {
                    ...conv.toObject(),
                    lastMessage: lastMessage || null,
                };
            })
        );

        res.status(200).json(conversationsWithLastMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch conversations" });
    }
};

// Get messages in a conversation
export const getMessages = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({ conversationId })
            .populate("sender", "username")
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

// Send message
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { conversationId, senderId, text } = req.body;

        if (!conversationId || !senderId || !text) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const message = await Message.create({
            conversationId,
            sender: senderId,
            text,
        });

        // Update conversation's updatedAt timestamp
        await Conversation.findByIdAndUpdate(conversationId, {
            updatedAt: new Date(),
        });

        const populated = await message.populate("sender", "username");

        res.status(201).json(populated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

// Get all users (for starting new conversations)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, "username email avatarUrl").limit(50);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// Search users by username
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== "string") {
            return res.status(400).json({ message: "Missing search query" });
        }

        const users = await User.find({
            username: { $regex: q, $options: "i" },
        }, "username email avatarUrl").limit(20);

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to search users" });
    }
};

