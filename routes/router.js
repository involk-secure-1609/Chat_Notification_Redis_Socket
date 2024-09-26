import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import messageRoutes from "./messageRoutes";
import { Router } from "express";

const router = Router();

router.use("/api/user", userRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/message", messageRoutes);

module.exports = router;
