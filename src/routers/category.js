import { Router } from "express";
import {
    create,
    deleteCategory,
    getAll,
    getCategoryById,
    updateCategory,
} from "../controllers/category";

const router = Router();

router.get("/categories", getAll);
router.get("/categories/:id", getCategoryById);
router.delete("/categories/:id", deleteCategory);
router.put("/categories/:id", updateCategory);
router.post("/categories", create);

export default router;
