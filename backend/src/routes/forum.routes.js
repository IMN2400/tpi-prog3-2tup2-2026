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


const router = Router();

router.get("/forums", getForums);
router.get("/forums/:id", getForumById);

router.post(
  "/forums",
  onlyAdminOrSysadmin,
  validateCreateForum, 
  createForum,
  
);

router.put(
  "/forums/:id",
  onlyAdminOrSysadmin,
  validateUpdateForum, 
  updateForum, 
);

router.delete(
  "/forums/:id",
   onlyAdminOrSysadmin, 
   deleteForum);

export default router;