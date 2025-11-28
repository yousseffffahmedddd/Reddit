// src/controllers/communityController.ts
import { Request, Response } from 'express';
import Community from '../models/CommunitySchema'; // Ensure this path matches your file structure

// 1. Get All Communities
export const getAllCommunities = async (req: Request, res: Response) => {
    try {
        // Fetch communities from DB (sorted by newest first)
        const communities = await Community.find().sort({ createdAt: -1 });
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching communities", error });
    }
};

// 2. Create a Community (For testing purposes)
export const createCommunity = async (req: Request, res: Response) => {
    try {
        const newCommunity = new Community(req.body);
        await newCommunity.save();
        res.status(201).json(newCommunity);
    } catch (error) {
        res.status(400).json({ message: "Error creating community", error });
    }
};