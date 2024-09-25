import UserService from '../Service/UserService';

class UserController{

    async createUser (req,res){
        return UserService.createUser(req,res);
    }

    async searchUser (req,res){
        return UserService.searchUser(req,res);

    }

    async updateUser (req,res){
        return UserService.updateUser(req,res);

    }

    async deleteUser (req,res){
        return UserService.deleteUser(req,res);
    }

}


export default new UserController();
