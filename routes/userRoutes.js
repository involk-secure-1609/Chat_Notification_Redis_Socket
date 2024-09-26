import { Router } from "express";
import UserController from "../Controller/UserController.js";
const router=Router();

router.post("/create",UserController.createUser)
router.get("/find",UserController.findUser)
router.get("/findAll",UserController.findAllUsers)
router.put("/update",UserController.updateUser)
router.delete("/delete",UserController.deleteUser)

export default router;