import express from "express";
import {
    getAllCommunities,
    createCommunity,
    joinCommunity,
    getJoinedCommunities
} from "../controllers/communityController";

const router = express.Router();

// 1. GET all communities
router.get("/", getAllCommunities);

// 2. Create a Community
router.post("/", createCommunity);

// 3. Join / Leave a Community
router.post("/join", joinCommunity);

// 4. Get communities joined by a specific user
router.get("/user/:userId", getJoinedCommunities);

export default router;
