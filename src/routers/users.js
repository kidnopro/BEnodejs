import express from "express";
import { deleteUsers, getUsers } from "../controllers/users";

const router = express.Router();

router.get(`/users`, getUsers);
router.delete("/users/:id", deleteUsers);
// router.post(`/users/:id`, updateUsers);

export default router;
