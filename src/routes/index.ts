import { Router } from "express";

import itemsRouter from "./items.routes.js";
import promotionsRouter from "./promotions.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();

router.use("/items", itemsRouter);
router.use("/promotions", promotionsRouter);
router.use("/auth", authRouter);

router.use("/", (req, res) => {
  res.send("Welcome to the API");
});

export default router;
