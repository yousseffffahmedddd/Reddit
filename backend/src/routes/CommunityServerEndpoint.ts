import express from "express";
import type { Request, Response } from "express"; // Use 'type' for TS interfaces
import Community from "../models/CommunitySchema";

const router = express.Router();

// GET all communities
router.get("/", async (req: Request, res: Response) => {
    try {
        const communities = await Community.find();
        res.json(communities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch communities" });
    }
});

// POST endpoint to Join/Leave
router.post("/join", async (req: Request, res: Response) => {
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
        // We cast 'member' to any to avoid TypeScript strictness errors with ObjectIds
        const isMember = community.members.some(
            (member: any) => member.toString() === userId
        );

        if (isMember) {
            // LEAVE: Filter user out
            community.members = community.members.filter(
                (member: any) => member.toString() !== userId
            );
        } else {
            // JOIN: Push user in
            // @ts-ignore (Mongoose handles the ObjectId conversion automatically)
            community.members.push(userId);
        }

        await community.save();

        res.json({
            success: true,
            isMember: !isMember,
            membersCount: community.members.length
        });

    } catch (err) {
        console.error("Join Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 👇  GET Communities that a specific user has joined
router.get("/user/:userId", async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        // Find communities where the 'members' array contains this userId
        const joinedCommunities = await Community.find({ members: userId });
        res.json(joinedCommunities);
    } catch (err) {
        console.error("Error fetching user communities:", err);
        res.status(500).json({ error: "Failed to fetch user communities" });
    }
});

export default router;