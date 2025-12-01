import mongoose, { Schema, Document } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommunitySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "communities" }
);

const Community = mongoose.models.Community || mongoose.model<ICommunity>("Community", CommunitySchema);
export default Community;
