import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token, "token")

    if (!token) {
      throw new Error();
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error while authenticating", error)
    res.status(401).json({ message: 'Please authenticate' });
  }
}; 