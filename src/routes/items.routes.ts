// import verifyToken from "../middlewares/authMiddleware.js";
// import authorizeRoles from "#middlewares/roleMiddleware.js";
import { upload } from "#middlewares/upload.js";
import { getItems, postItem } from "../controllers/items.controller.js";
import Router from "express";

const router = Router();

router.get("/", getItems);
router.post(
  "/",
  // verifyToken,
  // authorizeRoles("Administrator"),
  upload.single("image"),
  postItem
);

export default router;
