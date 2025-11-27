import mongoose, { Schema}from "mongoose";
const { ObjectId } = mongoose.Types;
const CommentSchema = new Schema({
  postId: { type: ObjectId, ref: "Post", required: true },   // Reference
  userId: { type: ObjectId, ref: "User", required: true },   // Reference

  content: { type: String, required: true },

  parentCommentId: { type: ObjectId, ref: "Comment", default: null }, // Nested comments

  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Comment", CommentSchema);