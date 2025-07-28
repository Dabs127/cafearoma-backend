import {
  forgotPassword,
  getSession,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
} from "../controllers/users.controller.js";
import { Router } from "express";
import verifyToken from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);
router.get("/session", verifyToken, getSession);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
