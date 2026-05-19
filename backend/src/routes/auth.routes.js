import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../middlewares/auth.validation.js";

const router = Router();

router.post("/register",validateRegister, registerUser);
router.post("/login",validateRegister, loginUser);

export default router;