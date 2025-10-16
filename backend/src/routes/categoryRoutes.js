import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
    getCategories,
    addCategory,
    deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCategories);
router.post("/", addCategory);
router.delete("/:name", deleteCategory);

export default router;
