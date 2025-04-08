import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = '7d';

export const generateToken = (userId: string | Types.ObjectId): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; iat: number; exp: number };
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 