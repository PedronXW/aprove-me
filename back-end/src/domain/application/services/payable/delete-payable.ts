import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { InactivePayableError } from '../../errors/inactive-payable-error'
import { PayableNonExistsError } from '../../errors/payable-non-exists'
import { PayableRepository } from '../../repositories/payable-repository'

type DeletePayableServiceRequest = {
  id: string
  assignorId: string
}

type DeletePayableServiceResponse = Either<
  PayableNonExistsError | InactivePayableError,
  boolean
>

@Injectable()
export class DeletePayableService {
  constructor(private payableRepository: PayableRepository) {}

  async execute({
    id,
    assignorId,
  }: DeletePayableServiceRequest): Promise<DeletePayableServiceResponse> {
    const payable = await this.payableRepository.findPayableById(id, assignorId)

    if (!payable) {
      return left(new PayableNonExistsError())
    }

    if (!payable.active) {
      return left(new InactivePayableError())
    }

    const result = await this.payableRepository.deletePayable(id)

    return right(result)
  }
}
