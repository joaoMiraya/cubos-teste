import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  constructor(private userService: UserService) {}

  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const user = await this.userService.getUserById(Number(id));
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching user' });
    }
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, email, password } = req.body;
      const user = await this.userService.createUser({ name, email, password });
      
      if (user.hasErrors()) {
        return res.status(400).json({ errors: user.getNotification().getErrors() });
      }

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  deactivate = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'Invalid ID' });
      }
      const user = await this.userService.deactivateUser(Number(id));
      
      if (user.hasErrors()) {
        return res.status(400).json({ errors: user.getNotification().getErrors() });
      }

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}