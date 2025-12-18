import { Request, Response } from "express";
import Community from "../models/CommunitySchema";
import CommunityRole from "../models/CommunityRoleSchema";
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