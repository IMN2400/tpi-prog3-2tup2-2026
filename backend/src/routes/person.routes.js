import { Router } from "express";
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
router.post("/persons", createPerson);
router.put("/persons/:id", updatePerson);
router.delete("/persons/:id", deletePerson);

export default router;