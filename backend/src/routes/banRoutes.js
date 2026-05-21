import { Router } from 'express';
import { createBan, getBans } from '../controllers/banController.js';

const router = Router();

router.post('/bans', createBan);
router.get('/bans', getBans);
router.get('/user/:id', getBanByUser);

export default router;