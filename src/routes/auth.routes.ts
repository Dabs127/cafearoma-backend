import {
  getSession,
  loginUser,
  refreshToken,
  registerUser,
} from "../controllers/users.controller.js";
import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", catchAsync(loginUser));
router.post("/register", registerUser);
router.post("/refresh", refreshToken);
router.get("/session", verifyToken, getSession);

export default router;
