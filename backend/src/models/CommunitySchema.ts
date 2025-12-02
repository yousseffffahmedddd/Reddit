import mongoose, { Schema, Document } from "mongoose";

export interface ICommunity extends Document {
    name: string;
    description?: string;
    ownerId: mongoose.Types.ObjectId;
    createdAt: Date;
    members: mongoose.Types.ObjectId[];
}

const CommunitySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        ownerId: { type: Schema.Types.ObjectId, ref: "User"},
        createdAt: { type: Date, default: Date.now },
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    {
        collection: "communities"
    }
);

const Community = mongoose.models.Community || mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;