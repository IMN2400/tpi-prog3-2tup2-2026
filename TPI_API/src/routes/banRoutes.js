import { Router } from 'express';
import { createBan, getBans } from '../controllers/banController.js';

const router = Router();

router.post('/', createBan);
router.get('/', getBans);
router.get('/user/:id', getBanByUser);

export default router;