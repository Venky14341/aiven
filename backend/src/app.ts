import express from 'express';
import cors from 'cors';
import researchRoutes from './routes/researchRoutes';
import authRoutes from './routes/authRoutes';
import { AppError } from './utils/errorHandler';
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOriginPatterns = [
  /^http:\/\/localhost:\d+$/,
  /^https:\/\/[\w-]+\.vercel\.app$/,
  ...(process.env.FRONTEND_URL ? [new RegExp(`^${process.env.FRONTEND_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)] : []),
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow server-to-server requests (no origin) and matched origins
    if (!origin || allowedOriginPatterns.some((p) => p.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
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
