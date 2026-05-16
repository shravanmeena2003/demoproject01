import { User, IUserDocument } from '../models/User';
import { RegisterInput } from '../validators/auth.validator';
import { UserRole } from '../constants';

export class UserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async create(data: RegisterInput): Promise<IUserDocument> {
    return User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: UserRole.SALES,
    });
  }
}

export const userRepository = new UserRepository();
