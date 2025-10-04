import express from 'express';
import "reflect-metadata";
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api', routes);

// Middlewares
app.use(errorHandler);

export default app;