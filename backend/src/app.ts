import express from 'express';
import "reflect-metadata";
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;