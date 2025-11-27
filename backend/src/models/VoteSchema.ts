import mongoose,{Schema} from "mongoose";
const {ObjectId}=mongoose.Types
const VoteSchema = new Schema({
  userId: { type: ObjectId, ref: "User", required: true },

  postId: { type: ObjectId, ref: "Post", default: null },
  commentId: { type: ObjectId, ref: "Comment", default: null },

  value: { type: Number, enum: [1, -1], required: true },

  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Vote", VoteSchema);