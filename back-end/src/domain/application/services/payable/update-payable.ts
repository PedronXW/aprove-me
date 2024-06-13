import { Either, left, right } from '@/@shared/either'
import { Payable } from '@/domain/enterprise/entities/payable'
import { Injectable } from '@nestjs/common'
import { PayableNonExistsError } from '../../errors/payable-non-exists'
import { PayableRepository } from '../../repositories/payable-repository'

type UpdatePayableServiceRequest = {
  id: string
  value?: number
  assignorId: string
  emissionDate?: Date
}

type UpdatePayableServiceResponse = Either<PayableNonExistsError, Payable>

@Injectable()
export class UpdatePayableService {
  constructor(private payableRepository: PayableRepository) {}

  async execute({
    value,
    id,
    emissionDate,
    assignorId,
  }: UpdatePayableServiceRequest): Promise<UpdatePayableServiceResponse> {
    const payable = await this.payableRepository.findPayableById(id, assignorId)

    if (!payable) {
      return left(new PayableNonExistsError())
    }

    payable.value = value ?? payable.value
    payable.emissionDate = emissionDate ?? payable.emissionDate

    const updatedPayable = await this.payableRepository.updatePayable(
      id,
      payable,
    )

    return right(updatedPayable)
  }
}
