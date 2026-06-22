import { Router } from "express";
import {
  getPosts,
  getPostById,
  getPostByForum,
  createPost,
  updatePost,
  deletearPost,
  likesPost
} from "../controllers/post.controller.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.get("/forums/:forumId/posts", getPostByForum);

router.post("/forums/:forumId/posts", verifyToken, createPost);

router.put("/posts/:id", verifyToken, updatePost);
router.delete("/posts/:id", verifyToken, deletearPost);
router.patch("/posts/:id/like", verifyToken, likesPost);

export default router;