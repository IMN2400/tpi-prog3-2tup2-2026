import { Router } from 'express';
import { createBan, getBans, getBanByUser, updateBan } from '../controllers/ban.controllers.js';

const router = Router();

router.post('/bans', createBan);
router.get('/bans', getBans);
router.get('/bans/user/:id', getBanByUser);
router.patch('/bans/:id', updateBan);

export default router;