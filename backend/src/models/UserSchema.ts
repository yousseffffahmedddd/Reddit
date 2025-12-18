import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string; // We store the hash, not the plain password
    profilePicture?: string; // URL/path to profile picture
    bio?: string;
    displayName?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePicture: { type: String, default: null },
    bio: { type: String, default: "", maxlength: 500 },
    displayName: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
}, {
    collection: "users" // Force collection name to be 'users'
});

// Overwrite protection
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;