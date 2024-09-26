import { Router } from "express";
import MessageController from "../Controller/MessageController";
const router=Router();

router.post('/sendMessage',MessageController.sendMessage);

export default router;