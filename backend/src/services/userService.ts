import { CreateUserDTO } from "../DTOs/userDTO";
import { User } from "../entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserRepository } from "../repositories/userRepository";



export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      return User.createWithError('User not found', 'id');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return User.createWithError('User not found', 'email');
    }

    return user;
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const userExists = await this.userRepository.findByEmail(data.email);
    
    if (userExists) {
      if (userExists.is_active) {
        return User.createWithError('Email already registered', 'email');
      }

      userExists.is_active = true;
      userExists.password = data.password;
      userExists.validate();
      
      if (userExists.hasErrors()) {
        return userExists;
      }
      await this.userRepository.save(userExists);
      return userExists;
    }

    const user = await this.userRepository.create(data);
    user.validate();
    if (user.hasErrors()) {
      return user;
    }

    await this.userRepository.save(user);
    
    return user;
  }

  async deactivateUser(id: number): Promise<User> {
    const user = await this.getUserById(id);
    if (user.hasErrors()) {
      return user;
    }
    await this.userRepository.deactivate(id);
    return user;
  }
}