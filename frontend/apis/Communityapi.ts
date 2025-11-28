// import express from "express";
// type Request = express.Request;
// type Response = express.Response;
// const router = express.Router();

// // Dummy community data
// const dummyCommunities = [
//   {
//     _id: "67a0222bcf1234abcd567111", // matches your CreatePost selectedCommunity
//     name: "user profile (/u)",
//   },
//   {
//     _id: "67a0333bcf1234abcd567222",
//     name: "reddit community (/r)",
//   },
// ];

// // GET all communities
// router.get("/", (req: Request, res: Response) => {
//   res.json(dummyCommunities);
// });

// export default router;

// src/routes/Communityapi.ts
import express, { Request, Response } from "express";
import mongoose from "mongoose";

const router = express.Router();

// Community schema
interface ICommunity extends mongoose.Document {
    name: string;
    description?: string;
}

const CommunitySchema = new mongoose.Schema<ICommunity>({
    name: { type: String, required: true },
    description: { type: String },
});

// Mongoose model
const Community =
    mongoose.models.Community || mongoose.model<ICommunity>("Community", CommunitySchema);

// GET all communities from DB
router.get("/", async (req: Request, res: Response) => {
    try {
        const communities = await Community.find();
        res.json(communities);
    } catch (err) {
        console.error("Failed to fetch communities:", err);
        res.status(500).json({ error: "Failed to fetch communities" });
    }
});

export default router;