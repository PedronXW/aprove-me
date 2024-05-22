import { UserRepository } from '@/domain/application/repositories/user-repository'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { UserMapper } from '../mappers/user-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(user: User): Promise<User> {
    await this.prisma.user.create({
      data: {
        id: user.id.getValue(),
        name: user.name,
        email: user.email,
        password: user.password as string,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return user
  }

  async changePassword(id: string, password: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        password,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return UserMapper.toDomain(user)
  }

  async deleteUser(id: string): Promise<boolean> {
    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: {
        active: false,
      },
    })

    return !deletedUser.active
  }

  async updateUser(id: string, name: string): Promise<User> {
    const editedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return UserMapper.toDomain(editedUser)
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }
}
