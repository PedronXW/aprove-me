import { Either, right } from '@/@shared/either'
import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'
import { PayableRepository } from '../../repositories/payable-repository'

export type CreatePayableServiceRequest = {
  value: number
  emissionDate: Date
  assignorId: string
  receiverId: string
}

export type CreatePayableServiceResponse = Either<Error, Payable>

export class CreatePayableService {
  constructor(private readonly payableRepository: PayableRepository) {}

  async execute({
    value,
    emissionDate,
    assignorId,
    receiverId,
  }: CreatePayableServiceRequest): Promise<CreatePayableServiceResponse> {
    const payable = Payable.create({
      value,
      emissionDate,
      assignorId: new EntityId(assignorId),
      receiverId: new EntityId(receiverId),
    })

    return right(await this.payableRepository.createPayable(payable))
  }
}
