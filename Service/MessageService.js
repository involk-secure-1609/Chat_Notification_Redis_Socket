import prisma from "../prisma_client.js";
import {redisClient} from "../redis.js";


class MessageService{

    async sendMessage(req,res){
        const Message={
            message:req.message,
            senderId:req.senderId,
            receiverId:req.receiverId,
            conversationId:req.conversationId,
        }

        await redisClient.publish(req.receiverId,JSON.stringify(Message));

        return res.status(200).json("Message sent successfully");
    }

}

redisClient.on('error',(err)=>{
    console.log(err);
})

export default new MessageService();