import { Router } from "express";
import {
    addItemToCart,
    decreaseProductQuantity,
    getCart,
    increaseProductQuantity,
    removeItemFromCart,
    updateProductQuantity,
} from "../controllers/cart";

const router = Router();

router.post("/carts/add-to-cart", addItemToCart);
router.get("/carts/:userId", getCart);
router.post("/carts/remove-cart", removeItemFromCart);
router.put("/carts/update-product-quantity", updateProductQuantity);
router.put("/carts/increase", increaseProductQuantity);
router.put("/carts/decrease", decreaseProductQuantity);

export default router;
