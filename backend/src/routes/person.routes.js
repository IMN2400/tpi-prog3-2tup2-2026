import { Router } from "express";
import { validateCreatePerson } from "../middlewares/person.validation.js";
import { validateUpdatePerson } from "../middlewares/person.validation.js";
import {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} from "../controllers/person.controller.js";

const router = Router();

router.get("/persons", getPersons);
router.get("/persons/:id", getPersonById);
router.put("/persons/:id",validateUpdatePerson, updatePerson);
router.delete("/persons/:id", deletePerson);
router.post("/persons", validateCreatePerson, createPerson);

export default router;