import {
  FindPayablesResponse,
  PayableRepository,
} from '@/domain/application/repositories/payable-repository'
import { Payable } from '@/domain/enterprise/entities/payable'
import { Injectable } from '@nestjs/common'
import { PayableMapper } from '../mappers/payable-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaPayableRepository implements PayableRepository {
  constructor(private prisma: PrismaService) {}

  async createPayable(data: Payable): Promise<Payable> {
    const createdPayable = await this.prisma.payable.create({
      data: PayableMapper.toPersistence(data),
    })

    return PayableMapper.toDomain(createdPayable)
  }

  async findPayableById(id: string): Promise<Payable> {
    const payable = await this.prisma.payable.findFirst({
      where: { id },
    })

    if (!payable) {
      return null
    }

    return PayableMapper.toDomain(payable)
  }

  async updatePayable(id: string, editedPayable: Payable): Promise<Payable> {
    const updatedPayable = await this.prisma.payable.update({
      where: { id },
      data: PayableMapper.toPersistence(editedPayable),
    })

    return PayableMapper.toDomain(updatedPayable)
  }

  async deletePayable(id: string): Promise<boolean> {
    const deletedPayable = await this.prisma.payable.delete({
      where: { id },
    })

    return !!deletedPayable
  }

  async findPayables(
    page: number,
    limit: number,
    assignorId: string,
  ): Promise<FindPayablesResponse> {
    const payables = await this.prisma.payable.findMany({
      where: {
        active: true,
        assignorId,
      },
      take: limit * 1,
      skip: (page - 1) * limit,
    })

    const total = await this.prisma.payable.count({
      where: {
        active: true,
        assignorId,
      },
    })

    return {
      payables: payables.map(PayableMapper.toDomain),
      payablesCount: total,
    }
  }
}
