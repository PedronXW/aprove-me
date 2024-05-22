import {
  AssignorRepository,
  FindAssignorsResponse,
} from '@/domain/application/repositories/assignor-repository'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { Injectable } from '@nestjs/common'
import { AssignorMapper } from '../mappers/assignor-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAssignorRepository implements AssignorRepository {
  constructor(private prisma: PrismaService) {}

  async createAssignor(assignor: Assignor): Promise<Assignor> {
    const createdAssignor = await this.prisma.assignor.create({
      data: AssignorMapper.toPersistence(assignor),
    })

    return AssignorMapper.toDomain(createdAssignor)
  }

  async updateAssignor(id: string, assignor: Assignor): Promise<Assignor> {
    const updatedAssignor = await this.prisma.assignor.update({
      where: { id },
      data: AssignorMapper.toPersistence(assignor),
    })

    return AssignorMapper.toDomain(updatedAssignor)
  }

  async deleteAssignor(id: string): Promise<boolean> {
    const deletedAssignor = await this.prisma.assignor.delete({
      where: { id },
    })

    return !!deletedAssignor
  }

  async findAssignorById(id: string, creatorId: string): Promise<Assignor> {
    const assignor = await this.prisma.assignor.findFirst({
      where: { id, creatorId },
    })

    if (!assignor) {
      return null
    }

    return AssignorMapper.toDomain(assignor)
  }

  async findAssignors(
    page: number,
    limit: number,
    creatorId: string,
  ): Promise<FindAssignorsResponse> {
    const assignors = await this.prisma.assignor.findMany({
      where: { creatorId },
      take: limit * 1,
      skip: (page - 1) * limit,
    })

    const total = await this.prisma.assignor.count({ where: { creatorId } })

    return {
      assignors: assignors.map(AssignorMapper.toDomain),
      assignorsCount: total,
    }
  }
}
