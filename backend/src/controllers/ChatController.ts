import { Request, Response } from "express";
import Conversation from "../models/ConversationSchema";
import Message from "../models/MessageSchema";


export const getOrCreateConversation = async (req: Request, res: Response) => {
    try {
        const { userId, otherUserId } = req.body;

        if (!userId || !otherUserId) {
            return res.status(400).json({ message: "Missing user IDs" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [userId, otherUserId],
            });
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create conversation" });
    }
};


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
