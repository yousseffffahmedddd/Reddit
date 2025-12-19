import express from "express";
import {
    getAllCommunities,
    createCommunity,
    joinCommunity,
    getJoinedCommunities,
    searchCommunities,
    updateCommunity,
    uploadCommunityIcon,
    getCommunityById,
    getOwnedCommunities
} from "../controllers/communityController";
import { uploadCommunityImage } from "../middleware/upload";

const router = express.Router();

router.get("/", getAllCommunities);
router.get("/search", searchCommunities);
router.post("/", createCommunity);
router.post("/join", joinCommunity);

router.get("/user/:userId", getJoinedCommunities);

// Get communities owned/administered by user
router.get("/owned/:userId", getOwnedCommunities);

// Get single community by ID or name
router.get("/:communityId", getCommunityById);

// Update community
router.put("/:communityId", updateCommunity);

// Upload community icon
router.post("/:communityId/icon", uploadCommunityImage.single("icon"), uploadCommunityIcon);

export default router;