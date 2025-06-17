import verifyToken from "#middlewares/authMiddleware.js";
import authorizeRoles from "#middlewares/roleMiddleware.js";
import {
  getPromotions,
  postPromotion,
} from "../controllers/promotions.controller.js";
import { upload } from "../middlewares/upload.js";
import Router from "express";

const router = Router();

router.get("/", getPromotions);
router.post(
  "/",
  verifyToken,
  authorizeRoles("Administrator"),
  upload.single("image"),
  postPromotion
);

export default router;
