import express from "express";
import { signup, login, logout, onboarding } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/onboarding", protectRoute, onboarding);

router.get("/me", protectRoute, (req, res) => {
  const user = req.user;

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    isOnboarded: user.isOnboarded,
    message: "User authenticated",
  });
});

export default router;
