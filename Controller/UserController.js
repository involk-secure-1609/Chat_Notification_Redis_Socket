import UserService from '../Service/UserService';

class UserController{

    async findAllUsers(req,res){
        return UserService.findAllUsers(req,res);
    }
    async createUser (req,res){
        return UserService.createUser(req,res);
    }

    async findUser (req,res){
        return UserService.findUser(req,res);

    }

    async updateUser (req,res){
        return UserService.updateUser(req,res);

    }

    async deleteUser (req,res){
        return UserService.deleteUser(req,res);
    }

}


export default new UserController();
