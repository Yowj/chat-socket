import express from "express";
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  searchUsers 
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllUsers);
router.get("/search", protectRoute, searchUsers);
router.get("/:id", protectRoute, getUserById);
router.put("/:id", protectRoute, updateUser);
router.delete("/:id", protectRoute, deleteUser);

export default router;