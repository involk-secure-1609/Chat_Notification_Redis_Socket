import prisma from "../prisma_client.js";
import {redisClient} from "../redis.js";


class MessageService{

    async sendMessage(req,res){
        const data=req.body;
        const Message={
            message:data.message,
            senderId:data.senderId,
            receiverId:data.receiverId,
            conversationId:data.conversationId,
        }

        await redisClient.publish(data.receiverId,JSON.stringify(Message));

        return res.status(200).json("Message sent successfully");
    }

}

redisClient.on('error',(err)=>{
    console.log(err);
})

export default new MessageService();