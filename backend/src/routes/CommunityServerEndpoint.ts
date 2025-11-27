// src/routes/community.ts
import express from "express";
const router = express.Router();

const dummyCommunities = [
  { _id: "67a0222bcf1234abcd567111", name: "Test Community" }
];

router.get("/", (req, res) => {
  res.json(dummyCommunities);
});

export default router;
