import {
  deleteUser,
  getUserById,
  sendEmailToAdmin,
  updateUser,
} from "#controllers/users.controller.js";
import verifyToken from "#middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/profile", verifyToken, getUserById);
router.put("/", verifyToken, updateUser);
router.delete("/", verifyToken, deleteUser);
router.post("/sendEmailToAdmin", sendEmailToAdmin);

export default router;
