import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }

    const token = authHeader.substring(7);

    const decoded = authService.verifyAccessToken(token);

    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: undefined,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalid or expired' });
  }
};
