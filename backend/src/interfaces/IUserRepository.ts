import { User } from "../entities/User";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  deactivate(id: number): Promise<void>;
  save(user: User): Promise<User>;
}