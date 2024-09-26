import MessageService from "../Service/MessageService"

class MessageController{

    async sendMessage(req,res)
    {
        return MessageService.sendMessage(req,res);
    }

}

export default new MessageController();