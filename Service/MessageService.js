import { redisClient } from "../redis.js";

class MessageService {
  async sendMessage(req, res) {
    const data = req.body;

    if (!data.receiverId || !data.senderId || !data.message) {
      return res.status(400).json("Invalid input -receiverId,senderId,and message are all required.");
    }

    const Message = {
      message: data.message,
      senderId: data.senderId,
      receiverId: data.receiverId,
      conversationId: data.conversationId,
    };

    try {
      await redisClient.publish(data.receiverId, JSON.stringify(Message));
      return res.status(200).json("Message sent successfully");
    } catch (error) {
      console.log("Error sending message-", error);
      return res.status(500).json("An error occurred while sending the message.");
    }
  }
}

redisClient.on("error", (err) => {
  console.log("Redis error:", err);
});

export default new MessageService();
