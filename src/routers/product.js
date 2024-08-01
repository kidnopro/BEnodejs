import { Router } from "express";
import {
  create,
  deleteProduct,
  getAll,
  getProductById,
  related,
  updateProduct,
  searchProducts,
} from "../controllers/product";

const router = Router();
router.get("/products", getAll);
router.get("/products/:categoryId/related/", related);
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);
router.post("/products", create);
router.get("/search", searchProducts);
export default router;



