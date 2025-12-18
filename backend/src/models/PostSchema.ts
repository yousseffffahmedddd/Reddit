import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
    title: string;
    content: string;
    postType: string;
    author: mongoose.Types.ObjectId;
    community: mongoose.Types.ObjectId;
    score: number;
    // Added votes array to track individual user actions
    votes: { userId: mongoose.Types.ObjectId; value: number }[];
}

const PostSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },

        // CHANGED: "Text" -> "text" to match your controller logic
        postType: {
            type: String,
            enum: ["text", "image", "link"],
            default: "text"
        },

        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        community: { type: Schema.Types.ObjectId, ref: "Community", required: true },

        // Determines the total calculated score
        score: { type: Number, default: 0 },

        // NEW: Stores who voted and what they voted (+1 or -1)
        votes: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
                value: { type: Number, required: true }, // 1 for up, -1 for down
            },
        ],
    },
    { timestamps: true }
);

const Post: Model<IPost> =
    mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;