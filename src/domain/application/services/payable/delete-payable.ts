import { Either, left, right } from '@/@shared/either'
import { PayableNonExistsError } from '../../errors/PayableNonExists'
import { PayableRepository } from '../../repositories/payable-repository'

type DeletePayableServiceRequest = {
  id: string
  receiverId: string
}

type DeletePayableServiceResponse = Either<PayableNonExistsError, boolean>

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

    const result = await this.payableRepository.deletePayable(id)

    return right(result)
  }
}
