import { Router } from 'express';
import { createBan, getBans } from '../controllers/ban.controllers.js';

const router = Router();

router.post('/bans', createBan);
router.get('/bans', getBans);
router.get('/user/:id', getBans);

export default router;