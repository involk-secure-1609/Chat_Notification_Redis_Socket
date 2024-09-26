import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import messageRoutes from "./messageRoutes.js";
import { Router } from "express";

const router = Router();

router.use("/api/user", userRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/message", messageRoutes);
export default router;
