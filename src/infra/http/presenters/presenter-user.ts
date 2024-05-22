import { User } from '@/domain/enterprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.getValue(),
      name: user.name,
      email: user.email,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
