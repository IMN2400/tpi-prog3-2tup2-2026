import { Router } from "express";
import { validateCreatePerson } from "../middlewares/person.validation.js";
import { validateUpdatePerson } from "../middlewares/person.validation.js";
import {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
  makeAdmin,
  getMyProfile,
  updateMyProfile
} from "../controllers/person.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { canManagePersons, onlySysAdmin } from "../middlewares/checkPersonPermissions.js";

const router = Router();

router.get("/persons", getPersons);
router.get("/persons/:id", getPersonById);

router.put(
  "/persons/:id",
  verifyToken,
  canManagePersons,
  validateUpdatePerson,
  updatePerson);

router.delete(
  "/persons/:id",
  verifyToken,
  canManagePersons,
  deletePerson
);

router.patch(
  "/persons/:id/make-admin",
  verifyToken,
  onlySysAdmin,
  makeAdmin
);

router.post("/persons", validateCreatePerson, createPerson);

router.patch(
  "/persons/me",
  verifyToken,
  updateMyProfile
);

router.get(
    "/persons/me",
    verifyToken,
    getMyProfile
);

export default router;