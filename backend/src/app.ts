import express from 'express';
import cors from 'cors';
import researchRoutes from './routes/researchRoutes';
import authRoutes from './routes/authRoutes';
import { AppError } from './utils/errorHandler';
import dotenv from "dotenv";
dotenv.config();

const app = express();

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Dynamically allow any origin requesting access (required when credentials are true)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Handle OPTIONS preflight requests for all routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
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
