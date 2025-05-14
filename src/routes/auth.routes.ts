import { LoginUser, RegisterUser } from "#controllers/users.controller.js";
import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.post("/login", catchAsync(LoginUser));
router.post("/register", catchAsync(RegisterUser));

export default router;
