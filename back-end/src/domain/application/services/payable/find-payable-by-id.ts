import { Either, left, right } from '@/@shared/either'
import { Payable } from '@/domain/enterprise/entities/payable'
import { Injectable } from '@nestjs/common'
import { PayableNonExistsError } from '../../errors/payable-non-exists'
import { PayableRepository } from '../../repositories/payable-repository'

type FindPayableByIdServiceRequest = {
  id: string
  assignorId: string
}

type FindPayableByIdServiceResponse = Either<PayableNonExistsError, Payable>

@Injectable()
export class FindPayableByIdService {
  constructor(private payableRepository: PayableRepository) {}

  async execute({
    id,
    assignorId,
  }: FindPayableByIdServiceRequest): Promise<FindPayableByIdServiceResponse> {
    const payable = await this.payableRepository.findPayableById(id, assignorId)

    if (!payable) {
      return left(new PayableNonExistsError())
    }

    return right(payable)
  }
}
