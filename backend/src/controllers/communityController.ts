import { Request, Response } from "express";
import Community from "../models/CommunitySchema";

// 1. Get All Communities (Sorted by newest)
export const getAllCommunities = async (req: Request, res: Response) => {
    try {
        const communities = await Community.find().sort({ createdAt: -1 });
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching communities", error });
    }
};

// 2. Create a Community
export const createCommunity = async (req: Request, res: Response) => {
    try {
        const newCommunity = new Community(req.body);
        await newCommunity.save();
        res.status(201).json(newCommunity);
    } catch (error) {
        res.status(400).json({ message: "Error creating community", error });
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