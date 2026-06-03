import { Router } from 'express';
import { createBan, getBans, getBanByUser } from '../controllers/ban.controllers.js';

const router = Router();

router.post('/bans', createBan);
router.get('/bans', getBans);
router.get('/bans/user/:id', getBanByUser);

export default router;