import prisma from "../prisma_client.js";
import bcrypt from "bcrypt"
class AuthService{

    async login(req, res){
        const {email,password}=req;
        const user=prisma.user.findUnique({
            where:{
                email: email
            }
        })

        if(!user)
        {
            return res.status(400).json("Please create an account.")
        }
        const check=await bcrypt.compare(user.password,password);
        if(!check)
        {
            return res.status(400).json("Your password is incorrect,Please try again.")
        }
        return res.status(200).json("You have logged in successfully.")
    }
}

export default new AuthService();