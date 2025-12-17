import { Server } from "socket.io";
import Message from "./models/MessageSchema";
import Conversation from "./models/ConversationSchema";

export const setupSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("joinConversation", (conversationId: string) => {
            socket.join(conversationId);
            console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
        });

        socket.on(
            "sendMessage",
            async ({
                conversationId,
                senderId,
                text,
            }: {
                conversationId: string;
                senderId: string;
                text: string;
            }) => {
                if (!conversationId || !senderId || !text) return;

                try {
                    const message = await Message.create({
                        conversationId,
                        sender: senderId,
                        text,
                    });

                    // Update conversation's updatedAt timestamp
                    await Conversation.findByIdAndUpdate(conversationId, {
                        updatedAt: new Date(),
                    });

                    // Populate sender info before emitting
                    const populatedMessage = await message.populate("sender", "username");

                    io.to(conversationId).emit("newMessage", populatedMessage);
                } catch (error) {
                    console.error("Error sending message:", error);
                    socket.emit("messageError", { error: "Failed to send message" });
                }
            }
        );

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
};
