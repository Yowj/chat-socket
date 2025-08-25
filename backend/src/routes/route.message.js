import express from "express";
import { 
  getMessages, 
  sendMessage, 
  deleteMessage, 
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/messages", protectRoute, getMessages);
router.post("/send", protectRoute, sendMessage);
router.delete("/:id", protectRoute, deleteMessage);

export default router;