import { Entity } from '../../../@shared/entities/entity'
import { EntityId } from '../../../@shared/entities/entity-id'
import { Optional } from '../../../@shared/types/optional'

type UserProps = {
  name: string
  email: string
  active: boolean
  password?: string
  createdAt: Date | null
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email(): string {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get password(): string | undefined {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get active(): boolean {
    return this.props.active
  }

  set active(active: boolean) {
    this.props.active = active
  }

  get createdAt(): Date | null {
    return this.props.createdAt
  }

  set createdAt(createdAt: Date | null) {
    this.props.createdAt = createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date | null | undefined) {
    this.props.updatedAt = updatedAt
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'active'>,
    id?: EntityId,
  ): User {
    const user = new User(
      {
        ...props,
        active: props.active ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    )

    return user
  }
}
