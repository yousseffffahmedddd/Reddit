import { Server } from "socket.io";
import Message from "./models/MessageSchema";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinConversation", (conversationId: string) => {
      socket.join(conversationId);
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

        const message = await Message.create({
          conversationId,
          sender: senderId,
          text,
        });

        io.to(conversationId).emit("newMessage", message);
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
