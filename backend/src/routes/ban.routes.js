import { Router } from 'express';
import { createBan, getBans, getBanByUser, updateBan } from '../controllers/ban.controllers.js';
import { verifyToken } from "../middlewares/verifyToken.js";
import { onlyAdminOrSysadmin } from "../middlewares/checkForumPermissions.js";

const router = Router();

router.post('/bans', verifyToken, onlyAdminOrSysadmin, createBan);
router.get('/bans', verifyToken, onlyAdminOrSysadmin, getBans);
router.get('/bans/user/:id', verifyToken, onlyAdminOrSysadmin, getBanByUser);
router.patch('/bans/:id', verifyToken, onlyAdminOrSysadmin, updateBan);

export default router;