import mongoose, { Schema}from "mongoose";
const { ObjectId } = mongoose.Types;
const CommunitySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,

  ownerId: { type: ObjectId, ref: "User", required: true },  // Reference
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Community", CommunitySchema);