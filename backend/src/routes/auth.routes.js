import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../middlewares/auth.validation.js";
import { verifyToken, returnTokenVerified } from '../middlewares/verifyToken.js'

const router = Router();

router.post("/register",validateRegister, registerUser);
router.post("/login",validateLogin, loginUser);
router.get("/token", verifyToken, returnTokenVerified )

export default router;