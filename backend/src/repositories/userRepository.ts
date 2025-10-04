import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { IUserRepository } from '../interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id, is_active: true },
      select: ['id', 'email', 'name', 'created_at']
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email }
    });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { name }
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.repository.create(userData);
  }

  async deactivate(id: number): Promise<void> {
    await this.repository.update(id, { is_active: false });
  }
  
  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }
}