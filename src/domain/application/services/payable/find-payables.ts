import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { PaginationError } from '../../errors/PaginationError'
import {
  FindPayablesResponse,
  PayableRepository,
} from '../../repositories/payable-repository'

type FindPayablesServiceRequest = {
  page: number
  limit: number
  receiverId: string
}

type FindPayablesServiceResponse = Either<PaginationError, FindPayablesResponse>

@Injectable()
export class FindPayablesService {
  constructor(private payableRepository: PayableRepository) {}

  async execute({
    page,
    limit,
    receiverId,
  }: FindPayablesServiceRequest): Promise<FindPayablesServiceResponse> {
    if (page <= 0 || limit <= 0) {
      return left(new PaginationError())
    }

    const payables = await this.payableRepository.findPayables(
      page,
      limit,
      receiverId,
    )

    return right(payables)
  }
}
