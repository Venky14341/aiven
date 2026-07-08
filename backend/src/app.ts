import express from 'express';
import cors from 'cors';
import researchRoutes from './routes/researchRoutes';
import authRoutes from './routes/authRoutes';
import { AppError } from './utils/errorHandler';
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Custom CORS Middleware (Foolproof and dynamic)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});
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
