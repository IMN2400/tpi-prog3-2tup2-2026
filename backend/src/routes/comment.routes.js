import { Router } from "express";
import {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  likeComment
} from "../controllers/comment.controller.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/comments", getAllComments);
router.get("/comments/:id", getCommentById);

router.get("/posts/:postId/comments", getCommentsByPost);
router.post("/posts/:postId/comments", verifyToken, createComment);

router.put("/comments/:id", verifyToken, updateComment);
router.delete("/comments/:id", verifyToken, deleteComment);
router.patch("/comments/:id/like", verifyToken, likeComment);

export default router;