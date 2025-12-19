import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash?: string; // Optional for OAuth users
    profilePicture?: string; // URL/path to profile picture
    bio?: string;
    displayName?: string;
    createdAt: Date;
    googleId?: string; // Google OAuth ID
    avatarUrl?: string; // Avatar URL from OAuth
    savedPosts: mongoose.Types.ObjectId[]; // Array of saved post IDs
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: false }, // Optional for OAuth users
    profilePicture: { type: String, default: null },
    bio: { type: String, default: "", maxlength: 500 },
    displayName: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    googleId: { type: String, required: false }, // Google OAuth ID
    avatarUrl: { type: String, default: null }, // Avatar URL from OAuth
    savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],
}, {
    collection: "users" // Force collection name to be 'users'
});

// Overwrite protection
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;