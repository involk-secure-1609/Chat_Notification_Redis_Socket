import { Router } from "express";
import MessageController from "../Controller/MessageController.js";
const router=Router();

router.post('/sendMessage',MessageController.sendMessage);

export default router;