import { Router } from "express";
import UserController from "../Controller/UserController";
const router=Router();

router.post("/create",UserController.createUser)
router.get("/search",UserController.searchUser)
router.put("/update",UserController.updateUser)
router.delete("//delete",UserController.deleteUser)

module.exports=router;