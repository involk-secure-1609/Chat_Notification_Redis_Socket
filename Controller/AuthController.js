import AuthService from '../Service/AuthService';

class AuthController{

    async login(req,res){
        return AuthService.login(req,res);
    }
   
}


export default new AuthController();
