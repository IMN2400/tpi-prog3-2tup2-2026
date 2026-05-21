import { Router } from "express";

import { getPosts, getPostById, createPost, updatePost, deletearPost, likesPost } from "../controllers/post.controller.js"

const router = Router()

router.get("/posts", getPosts)
router.get("/posts/:id", getPostById)
router.post("/posts", createPost)
router.put("/posts/:id", updatePost)
router.delete("/posts/:id", deletearPost)
router.put("/posts/:id", likesPost)

export default router