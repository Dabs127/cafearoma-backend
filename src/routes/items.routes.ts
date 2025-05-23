import { getItems } from "../controllers/items.controller.js";
import Router from "express";
// import verifyToken from "../middlewares/authMiddleware.js";
// import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", getItems);

export default router;
