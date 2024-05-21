import { User } from '@/domain/enterprise/entities/user';

export abstract class UserRepository {
  abstract createUser(user: User): Promise<User>

  abstract changePassword(id: string, password: string): Promise<User>

  abstract deleteUser(id: string): Promise<boolean>

  abstract updateUser(id: string, name: string): Promise<User>

  abstract findUserByEmail(email: string): Promise<User | null>

  abstract findUserById(id: string): Promise<User | null>
}
