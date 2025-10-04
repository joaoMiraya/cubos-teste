import { Router } from 'express';
import { UserService } from '../services/userService';
import { AuthController } from '../controllers/authController';

const authRouter = Router();
const userService = new UserService();
const authController = new AuthController(userService);

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refreshToken);
//authRouter.post('/logout', authController.create);

export default authRouter;