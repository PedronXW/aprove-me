import { Either, left, right } from '@/@shared/either'
import { InactivePayableError } from '../../errors/InactivePayableError'
import { PayableNonExistsError } from '../../errors/PayableNonExists'
import { PayableRepository } from '../../repositories/payable-repository'

type DeletePayableServiceRequest = {
  id: string
  receiverId: string
}

type DeletePayableServiceResponse = Either<
  PayableNonExistsError | InactivePayableError,
  boolean
>

export class DeletePayableService {
  constructor(private payableRepository: PayableRepository) {}

  async execute({
    id,
    receiverId,
  }: DeletePayableServiceRequest): Promise<DeletePayableServiceResponse> {
    const payable = await this.payableRepository.findPayableById(id, receiverId)

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
