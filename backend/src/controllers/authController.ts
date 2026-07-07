import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'aivenky-default-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// In-memory user store (swap with a real DB in production)
interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}

const users = new Map<string, StoredUser>();

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function signToken(payload: { id: string; email: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

  if (!email || !password || !name) {
    res.status(400).json({ message: 'Name, email, and password are required.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (users.has(normalizedEmail)) {
    res.status(409).json({ message: 'An account with this email already exists.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = generateId();

  const newUser: StoredUser = { id, email: normalizedEmail, name: name.trim(), passwordHash };
  users.set(normalizedEmail, newUser);

  const token = signToken({ id, email: normalizedEmail, name: name.trim() });

  res.status(201).json({
    message: 'Account created successfully.',
    token,
    user: { id, email: normalizedEmail, name: name.trim() },
  });
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = users.get(normalizedEmail);

  if (!user) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const token = signToken({ id: user.id, email: user.email, name: user.name });

  res.json({
    message: 'Login successful.',
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
};

// POST /api/auth/demo
export const demoLogin = async (_req: Request, res: Response): Promise<void> => {
  const demoUser = { id: 'demo-user', email: 'demo@aivenky.com', name: 'Investor' };
  const token = signToken(demoUser);

  res.json({
    message: 'Demo login successful.',
    token,
    user: demoUser,
  });
};
