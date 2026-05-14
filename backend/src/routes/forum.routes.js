import { Router } from "express";
import {
  getForums,
  getForumById,
  createForum,
  updateForum,
  deleteForum,
} from "../controllers/forum.controller.js";
import {
  validateCreateForum,
  validateUpdateForum,
} from "../middlewares/forum.validation.js";

import { onlyAdminOrSysadmin } from "../middlewares/checkForumPermissions.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = Router();

router.get("/forums", getForums);
router.get("/forums/:id", getForumById);

router.post(
  "/forums",
  verifyToken,
  onlyAdminOrSysadmin,
  validateCreateForum, 
  createForum,
  
);

router.put(
  "/forums/:id",
  verifyToken,
  onlyAdminOrSysadmin,
  validateUpdateForum, 
  updateForum, 
);

router.delete(
  "/forums/:id",
  verifyToken,
  onlyAdminOrSysadmin, 
  deleteForum);

export default router;