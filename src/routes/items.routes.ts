import { getItems } from "#controllers/items.controller.js";
import Router from "express";

const router = Router();

router.get("/", getItems);

export default router;
