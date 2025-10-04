import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';

const authService = new AuthService();

export class AuthController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, email, password } = req.body;
      const user = await this.userService.createUser({ name, email, password });
      
      if (user.hasErrors()) {
        return res.status(400).json({ errors: user.getNotification().getErrors() });
      }
      const tokens = authService.generateTokens({
        userId: String(user.id),
        email: user.email,
        role: undefined
      });

      res.json({
        message: 'Success login',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        ...tokens,
      });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

       const user = await this.userService.getUserByEmail(email);
      
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isValidPassword = await user.validatePassword(password);

      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      const tokens = authService.generateTokens({
        userId: String(user.id),
        email: user.email,
        role: undefined,
      });

      res.json({
        message: 'Success login',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        ...tokens,
      });

    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token not provided' });
        return;
      }

      const decoded = authService.verifyRefreshToken(refreshToken);

      const tokens = authService.generateTokens({
        userId: decoded.userId,
        email: decoded.email,
        role: undefined,
      });

      res.json({
        message: 'Tokens refreshed successfully',
        ...tokens,
      });
    } catch (error) {
      res.status(401).json({ error: 'Refresh token invalid' });
    }
  }
}