import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
