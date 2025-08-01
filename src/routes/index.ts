import { Router } from "express";

import itemsRouter from "./items.routes.js";
import promotionsRouter from "./promotions.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use("/items", itemsRouter);
router.use("/promotions", promotionsRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);

// router.use("/", (req, res) => {
//   console.log("Cookies en /api/debug-cookies:", req.cookies);

//   res.json({ cookies: req.cookies as string });
//   // res.send("Welcome to the API");
// });

export default router;
