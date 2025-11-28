import { Router } from "express";
import { getUserById, getUserPosts } from "../controllers/userController.ts";

const router = Router();

router.get("/:id", getUserById);
router.get("/:id/posts", getUserPosts);

export default router;