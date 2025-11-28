import express from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose"; // <--- YOU ARE MISSING THIS LINE

const router = express.Router();

// ... rest of your code ...
// 1. Define the Schema right here
interface ICommunity extends mongoose.Document {
    name: string;
    description?: string;
}

const CommunitySchema = new mongoose.Schema<ICommunity>({
    name: { type: String, required: true },
    description: { type: String },
});

// 2. Create the Model
// The '||' check prevents "OverwriteModelError" when the server restarts
const Community = mongoose.models.Community || mongoose.model<ICommunity>("Community", CommunitySchema);

// 3. GET Route (Fetch Communities)
router.get("/", async (req: Request, res: Response) => {
    try {
        const communities = await Community.find();
        res.json(communities);
    } catch (err) {
        console.error("Error fetching communities:", err);
        res.status(500).json({ error: "Failed to fetch communities" });
    }
});

// 4. POST Route (Create Community)
router.post("/", async (req: Request, res: Response) => {
    try {
        const newCommunity = new Community(req.body);
        await newCommunity.save();
        res.status(201).json(newCommunity);
    } catch (err) {
        res.status(400).json({ error: "Failed to create community" });
    }
});

export default router;