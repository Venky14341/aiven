import express from 'express';
import cors from 'cors';
import researchRoutes from './routes/researchRoutes';
import authRoutes from './routes/authRoutes';
import { AppError } from './utils/errorHandler';
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', researchRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message || 'Internal server error' });
});

export default app;
