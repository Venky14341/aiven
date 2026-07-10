import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'investiq-default-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(payload: { id: string; email: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

    if (!email || !password || !name) {
      res.status(400).json({ message: 'Name, email, and password are required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
    });

    const token = signToken({ id: String(newUser.id), email: newUser.email, name: newUser.name });

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating account.' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = signToken({ id: String(user.id), email: user.email, name: user.name });

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error during login.' });
  }
};


// POST /api/auth/demo
export const demoLogin = async (_req: Request, res: Response): Promise<void> => {
  const demoUser = { id: 'demo-user', email: 'demo@investiq.com', name: 'Investor' };
  const token = signToken(demoUser);

  res.json({
    message: 'Demo login successful.',
    token,
    user: demoUser,
  });
};
