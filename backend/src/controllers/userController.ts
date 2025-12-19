
import { Request, Response } from "express";
import { Request as MulterRequest } from "express";
import User from "../models/UserSchema";
import path from "path";
import fs from "fs";

// 1. Get User Profile by Username (Public View)
export const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        // Find user but EXCLUDE password
        const user = await User.findOne({ username }).select("-passwordHash");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Error fetching user profile" });
    }
};

// 2. Update User Profile (Bio, Avatar, etc.)
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        // We assume userId comes from the frontend (or auth middleware)
        const { userId, bio, profilePicture, displayName } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find and update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                bio,
                profilePicture,
                displayName
            },
            { new: true } // Return the updated document
        ).select("-passwordHash"); // Do not return password

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
};

// 3. Upload Profile Picture
export const uploadProfilePicture = async (req: any, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Get the current user to check for existing profile picture
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            // Delete the uploaded file since user doesn't exist
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "User not found" });
        }

        // Delete old profile picture if it exists
        if (currentUser.profilePicture) {
            const oldPicturePath = path.join(__dirname, "../../uploads/profiles", path.basename(currentUser.profilePicture));
            if (fs.existsSync(oldPicturePath)) {
                fs.unlinkSync(oldPicturePath);
            }
        }

        // Create the URL for the uploaded file
        const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;

        // Update user with new profile picture URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: profilePictureUrl },
            { new: true }
        ).select("-passwordHash");

        res.status(200).json({
            message: "Profile picture uploaded successfully",
            user: updatedUser,
            profilePicture: profilePictureUrl
        });
    } catch (error) {
        console.error("Upload Profile Picture Error:", error);
        res.status(500).json({ message: "Error uploading profile picture" });
    }
};

// 4. Delete Profile Picture
export const deleteProfilePicture = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the file if it exists
        if (user.profilePicture) {
            const picturePath = path.join(__dirname, "../../uploads/profiles", path.basename(user.profilePicture));
            if (fs.existsSync(picturePath)) {
                fs.unlinkSync(picturePath);
            }
        }

        // Update user to remove profile picture reference
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: null },
            { new: true }
        ).select("-passwordHash");

        res.status(200).json({
            message: "Profile picture deleted successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Delete Profile Picture Error:", error);
        res.status(500).json({ message: "Error deleting profile picture" });
    }
};
