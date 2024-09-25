import userRoutes from './userRoutes';
import { Router} from 'express';

const router =Router()


router.use("/api/user",userRoutes);


module.exports = router;   
