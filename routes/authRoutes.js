import { Router } from "express";
import AuthController from "../Controller/AuthController.js";
const router=Router();

router.post('/login',AuthController.login)

export default router;