import express from "express";
import { forgotPassword, signin, signup } from "../controllers/auth";

const router = express.Router();

router.post(`/auth/signup`, signup);
router.post(`/auth/signin`, signin);
router.post(`/auth/forgot`, forgotPassword);
export default router;
