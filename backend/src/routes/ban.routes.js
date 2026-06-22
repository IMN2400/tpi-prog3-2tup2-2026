import { Router } from 'express';
import { createBan, getBans, getBanByUser, updateBan } from '../controllers/ban.controllers.js';
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post('/bans', verifyToken, createBan);
router.get('/bans',verifyToken, getBans);
router.get('/bans/user/:id', getBanByUser);
router.patch('/bans/:id',verifyToken, updateBan);

export default router;