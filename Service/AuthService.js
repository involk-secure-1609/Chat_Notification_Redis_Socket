import prisma from "../prisma_client.js";
import bcrypt from "bcrypt"
class AuthService{

    async login(req, res){
        const {email,password}=req.body;
        const user=await prisma.user.findUnique({
            where:{
                email: email
            }
        })

        if(!user)
        {
            return res.status(400).json("Please create an account.")
        }
        const check=await bcrypt.compare(password,user.password);
        if(!check)
        {
            return res.status(400).json("Your password is incorrect,Please try again.")
        }
        return res.status(200).json(user);
    }
}

export default new AuthService();