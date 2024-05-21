import { Either, left, right } from '@/@shared/either'
import { Payable } from '@/domain/enterprise/entities/payable'
import { PayableNonExistsError } from '../../errors/PayableNonExists'
import { PayableRepository } from '../../repositories/payable-repository'

type FindPayableByIdServiceRequest = {
  id: string
  receiverId: string
}

type FindPayableByIdServiceResponse = Either<PayableNonExistsError, Payable>

export class FindPayableByIdService {
  constructor(private payableRepository: PayableRepository) {}

  async execute({
    id,
    receiverId,
  }: FindPayableByIdServiceRequest): Promise<FindPayableByIdServiceResponse> {
    const payable = await this.payableRepository.findPayableById(id, receiverId)

    if (!payable) {
      return left(new PayableNonExistsError())
    }

    return right(payable)
  }
}
