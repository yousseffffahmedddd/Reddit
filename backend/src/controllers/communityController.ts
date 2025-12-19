import { Request, Response } from "express";
import Community from "../models/CommunitySchema";
import CommunityRole from "../models/CommunityRoleSchema";
import path from "path";
import fs from "fs";
// 1. Get All Communities (Sorted by newest)
export const getAllCommunities = async (req: Request, res: Response) => {
    try {
        const communities = await Community.find().sort({ createdAt: -1 });
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching communities", error });
    }
};

// 2. Create a Community (Updated)
export const createCommunity = async (req: Request, res: Response) => {
    try {
        const { name, description, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required to create a community" });
        }

        // 1. Create the Community
        // We automatically add the creator to the 'members' array
        const newCommunity = new Community({
            name,
            description,
            members: [userId]
        });
        const savedCommunity = await newCommunity.save();

        // 2. Assign the 'admin' role to the creator
        // 2. Assign the 'admin' role to the creator
        await CommunityRole.create({
            communityId: savedCommunity._id,
            userId: userId,
            role: "admin"
        });

        res.status(201).json(savedCommunity);
    } catch (error) {
        console.error("Create Community Error:", error);
        res.status(500).json({ message: "Error creating community", error });
    }
};
// 3. Join / Leave Community
export const joinCommunity = async (req: Request, res: Response) => {
    const { communityId, userId } = req.body;

    if (!communityId || !userId) {
        res.status(400).json({ error: "Missing communityId or userId" });
        return;
    }

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            res.status(404).json({ error: "Community not found" });
            return;
        }

        // Check if user is already a member
        const isMember = community.members.some(
            (member: any) => member.toString() === userId
        );

        if (isMember) {
            // LEAVE
            community.members = community.members.filter(
                (member: any) => member.toString() !== userId
            );
        } else {

            community.members.push(userId);
        }

        await community.save();

        res.json({
            success: true,
            isMember: !isMember,
            membersCount: community.members.length,
        });
    } catch (err) {
        console.error("Join Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 4. Get Communities Joined by User
export const getJoinedCommunities = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const joinedCommunities = await Community.find({ members: userId });
        res.json(joinedCommunities);
    } catch (err) {
        console.error("Error fetching user communities:", err);
        res.status(500).json({ error: "Failed to fetch user communities" });
    }
};


// 5. Search Communities by Name
export const searchCommunities = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== "string") {
            return res.status(400).json({ message: "Search query is required" });
        }

        const communities = await Community.find({
            name: { $regex: q, $options: "i" } // 'i' makes it case-insensitive
        }).limit(10); // Limit to 10 results for performance

        res.status(200).json(communities);
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Error searching communities", error });
    }
};

// 6. Update Community
export const updateCommunity = async (req: Request, res: Response) => {
    try {
        const { communityId } = req.params;
        const { userId, description } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find the community
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Check if user is admin of this community
        const userRole = await CommunityRole.findOne({
            communityId: communityId,
            userId: userId,
            role: "admin"
        });

        if (!userRole) {
            return res.status(403).json({ message: "Not authorized to update this community" });
        }

        // Update the community
        if (description !== undefined) {
            community.description = description;
        }

        await community.save();

        res.status(200).json(community);
    } catch (error) {
        console.error("Update Community Error:", error);
        res.status(500).json({ message: "Error updating community", error });
    }
};

// 7. Upload Community Icon
export const uploadCommunityIcon = async (req: any, res: Response) => {
    try {
        const { communityId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Find the community
        const community = await Community.findById(communityId);
        if (!community) {
            // Delete the uploaded file since community doesn't exist
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Community not found" });
        }

        // Check if user is admin of this community
        const userRole = await CommunityRole.findOne({
            communityId: communityId,
            userId: userId,
            role: "admin"
        });

        if (!userRole) {
            // Delete the uploaded file since user is not authorized
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ message: "Not authorized to update this community" });
        }

        // Delete old icon if it exists
        if (community.iconUrl) {
            const oldIconPath = path.join(__dirname, "../../uploads/communities", path.basename(community.iconUrl));
            if (fs.existsSync(oldIconPath)) {
                fs.unlinkSync(oldIconPath);
            }
        }

        // Create the URL for the uploaded file
        const iconUrl = `/uploads/communities/${req.file.filename}`;

        // Update community with new icon URL
        community.iconUrl = iconUrl;
        await community.save();

        res.status(200).json({
            message: "Community icon uploaded successfully",
            community: community,
            iconUrl: iconUrl
        });
    } catch (error) {
        console.error("Upload Community Icon Error:", error);
        res.status(500).json({ message: "Error uploading community icon" });
    }
};

// 8. Get Community by ID or Name
export const getCommunityById = async (req: Request, res: Response) => {
    try {
        const { communityId } = req.params;

        // Try to find by ID first, then by name
        let community = await Community.findById(communityId).catch(() => null);

        if (!community) {
            community = await Community.findOne({ name: communityId });
        }

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        res.status(200).json(community);
    } catch (error) {
        console.error("Get Community Error:", error);
        res.status(500).json({ message: "Error fetching community", error });
    }
};
