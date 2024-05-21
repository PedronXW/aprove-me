import { DomainEvents } from '@/@shared/events/event-dispatcher'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { User } from '@/domain/enterprise/entities/user'

export class InMemoryUserRepository implements UserRepository {
  users: User[] = []

  async createUser(user: User): Promise<User> {
    this.users.push(user)

    DomainEvents.markAggregateForDispatch(user)

    DomainEvents.dispatchEventsForAggregate(user.id)

    return user
  }

  async changePassword(id: string, password: string): Promise<User> {
    const userIndex = this.users.findIndex((c) => c.id.getValue() === id)

    this.users[userIndex].password = password
    this.users[userIndex].updatedAt = new Date()

    return this.users[userIndex]
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((c) => c.email === email)

    if (!user) return null

    return user
  }

  async findUserById(id: string): Promise<User | null> {
    const user = this.users.find((c) => c.id.getValue() === id)

    if (!user) return null

    return user
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex((c) => c.id.getValue() === id)

    this.users.splice(userIndex, 1)

    return true
  }

  async updateUser(id: string, name: string): Promise<User> {
    const userIndex = this.users.findIndex((c) => c.id.getValue() === id)

    if (userIndex === -1) throw new Error('User not found')

    this.users[userIndex].updatedAt = new Date()

    if (name) this.users[userIndex].name = name

    return this.users[userIndex]
  }
}
