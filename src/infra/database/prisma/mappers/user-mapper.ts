import { EntityId } from '@/@shared/entities/entity-id'
import { User } from '@/domain/enterprise/entities/user'

export class UserMapper {
  static toDomain(raw): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        active: raw.active,
        password: raw.password,
        createdAt: new Date(raw.createdAt),
        updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : null,
      },
      new EntityId(raw.id),
    )
  }

  static toPersistence(User: User) {
    return {
      id: User.id.getValue(),
      name: User.name,
      email: User.email,
      password: User.password,
      createdAt: User.createdAt?.toString() || new Date().getTime().toString(),
      updatedAt: User.updatedAt ? User.updatedAt?.toString() : true,
    }
  }
}
