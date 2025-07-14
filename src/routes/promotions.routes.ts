import verifyToken from "#middlewares/authMiddleware.js";
import authorizeRoles from "#middlewares/roleMiddleware.js";
import {
  deletePromotion,
  getPromotionById,
  getPromotions,
  postPromotion,
  updatePromotion,
} from "../controllers/promotions.controller.js";
import { upload } from "../middlewares/upload.js";
import Router from "express";

const router = Router();

router.get("/", getPromotions);
router.get("/:id", getPromotionById);
router.post(
  "/",
  verifyToken,
  authorizeRoles("Administrator"),
  upload.single("image"),
  postPromotion
);
router.patch("/", upload.single("image"), updatePromotion);
router.delete("/", deletePromotion);

export default router;
