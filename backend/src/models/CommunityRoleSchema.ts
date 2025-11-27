import mongoose, { Schema}from "mongoose";
const { ObjectId } = mongoose.Types;
const CommunityRoleSchema = new Schema({
  userId: { type: ObjectId, ref: "User", required: true },
  communityId: { type: ObjectId, ref: "Community", required: true },

  role: { type: String, enum: ["member", "moderator", "admin"], default: "member" },
  joinedAt: { type: Date, default: Date.now }
});

export default mongoose.model("CommunityRole", CommunityRoleSchema);