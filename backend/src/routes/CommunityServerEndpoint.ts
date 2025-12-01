import express, { Request, Response } from "express";
import Community from "../models/CommunitySchema"; // Matches the file we just made

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        console.log("Fetching communities...");
        const communities = await Community.find();
        res.json(communities);
    } catch (err) {
        console.error("Failed to fetch communities:", err);
        res.status(500).json({ error: "Failed to fetch communities" });
    }
});

export default router;
