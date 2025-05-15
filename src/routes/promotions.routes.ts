import { getPromotions } from "../controllers/promotions.controller.js";
import Router from "express";

const router = Router();

router.get("/", getPromotions);

export default router;
