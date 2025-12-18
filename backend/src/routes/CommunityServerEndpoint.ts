import express from "express";
import {
    getAllCommunities,
    createCommunity,
    joinCommunity,
    getJoinedCommunities,
    searchCommunities // <--- Import the new function
} from "../controllers/communityController";

const router = express.Router();

router.get("/", getAllCommunities);
router.get("/search", searchCommunities);
router.post("/", createCommunity);
router.post("/join", joinCommunity);

router.get("/user/:userId", getJoinedCommunities);

export default router;