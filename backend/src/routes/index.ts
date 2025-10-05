import { Router } from 'express';
import userRouter from './userRoutes';
import authRouter from './authRoutes';
import movieRouter from './movieRoutes';
import { authenticate } from '../middlewares/authenticator';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/auth', authRouter);
routes.use('/movies', authenticate, movieRouter);


export { routes };