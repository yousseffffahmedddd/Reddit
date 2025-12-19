// filepath: src/routes/userRoutes.ts
import express from "express";
import {
    getUserByUsername,
    updateUserProfile,
    uploadProfilePicture,
    deleteProfilePicture,
    savePost,
    getSavedPosts
} from "../controllers/userController";
import { uploadProfilePicture as uploadMiddleware } from "../middleware/upload";

const router = express.Router();

// GET public profile: http://localhost:3000/api/users/profile/someUsername
router.get("/profile/:username", getUserByUsername);

// PUT update profile: http://localhost:3000/api/users/profile
router.put("/profile", updateUserProfile);

// POST upload profile picture: http://localhost:3000/api/users/profile/picture
router.post("/profile/picture", uploadMiddleware.single("profilePicture"), uploadProfilePicture);

// DELETE profile picture: http://localhost:3000/api/users/profile/picture
router.delete("/profile/picture", deleteProfilePicture);

// POST save/unsave post (toggle): http://localhost:3000/api/users/save-post
router.post("/save-post", savePost);

// GET saved posts: http://localhost:3000/api/users/saved-posts/:userId
router.get("/saved-posts/:userId", getSavedPosts);

export default router;