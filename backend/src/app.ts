import express from 'express';
import "reflect-metadata";
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './routes';
import cors from 'cors';

const app = express();
// Cors
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middlewares
app.use(errorHandler);

app.use(express.json());

// Routes
app.use('/api', routes);

export default app;