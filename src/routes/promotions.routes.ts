import {
  getPromotions,
  postPromotion,
} from "../controllers/promotions.controller.js";
import Router from "express";

const router = Router();

router.get("/", getPromotions);
router.post("/", postPromotion);

export default router;
