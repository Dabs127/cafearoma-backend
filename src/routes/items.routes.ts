import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "#middlewares/roleMiddleware.js";
import { upload } from "../middlewares/upload.js";
import {
  deleteItem,
  getItemById,
  getItems,
  postItem,
  updateItem,
} from "../controllers/items.controller.js";
import Router from "express";

const router = Router();

router.get("/", getItems);
router.get("/:id", getItemById);
router.post(
  "/",
  verifyToken,
  authorizeRoles("Administrator"),
  upload.single("image"),
  postItem
);
router.delete("/", verifyToken, authorizeRoles("Administrator"), deleteItem);
router.patch(
  "/",
  verifyToken,
  authorizeRoles("Administrator"),
  upload.single("image"),
  updateItem
);

export default router;
