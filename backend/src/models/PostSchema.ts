// backend/src/models/PostSchema.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  postType: "Text" | "Image" | "Link";
  author: mongoose.Types.ObjectId;
  community: mongoose.Types.ObjectId;
  upvotes: number;
  downvotes?: number;
  comments: mongoose.Types.ObjectId[];
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    postType: {
      type: String,
      enum: ["text", "image", "link"],
      default: "text",
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    community: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;