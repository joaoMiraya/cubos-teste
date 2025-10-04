import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';

const userRouter = Router();
const userService = new UserService();
const userController = new UserController(userService);

userRouter.post('/', userController.create);
userRouter.get('/:id', userController.getById);
userRouter.get('/deactivate/:id', userController.deactivate);

export default userRouter;