import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'investiq-default-secret-change-me';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Authentication disabled: inject mock user and proceed
  req.user = { id: 'demo-user-id', email: 'demo@investiq.com', name: 'Demo User' };
  next();
};
