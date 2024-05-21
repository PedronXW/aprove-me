import { Either, left, right } from '@/@shared/either'
import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'
import { PayableNonExistsError } from '../../errors/PayableNonExists'
import { PayableRepository } from '../../repositories/payable-repository'

type UpdatePayableServiceRequest = {
  id: string
  value?: number
  emissionDate?: Date
  assignorId?: string
  receiverId: string
}

type UpdatePayableServiceResponse = Either<PayableNonExistsError, Payable>

export class UpdatePayableService {
  constructor(private payableRepository: PayableRepository) {}

  async execute({
    assignorId,
    emissionDate,
    value,
    id,
    receiverId,
  }: UpdatePayableServiceRequest): Promise<UpdatePayableServiceResponse> {
    const payable = await this.payableRepository.findPayableById(id, receiverId)

    if (!payable) {
      return left(new PayableNonExistsError())
    }

    payable.assignorId = new EntityId(assignorId) ?? payable.assignorId
    payable.emissionDate = emissionDate ?? payable.emissionDate
    payable.value = value ?? payable.value

    const updatedPayable = await this.payableRepository.updatePayable(
      id,
      payable,
    )

    return right(updatedPayable)
  }
}
