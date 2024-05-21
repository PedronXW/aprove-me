import { Either, left, right } from '@/@shared/either'
import { PaginationError } from '../../errors/PaginationError'
import {
  AssignorRepository,
  FindAssignorsResponse,
} from '../../repositories/assignor-repository'

type FindAssignorsServiceRequest = {
  page: number
  limit: number
  creatorId: string
}

type FindAssignorsServiceResponse = Either<
  PaginationError,
  FindAssignorsResponse
>

export class FindAssignorsService {
  constructor(private assignorRepository: AssignorRepository) {}

  async execute({
    page,
    limit,
    creatorId,
  }: FindAssignorsServiceRequest): Promise<FindAssignorsServiceResponse> {
    if (page <= 0 || limit <= 0) {
      return left(new PaginationError())
    }

    const assignors = await this.assignorRepository.findAssignors(
      page,
      limit,
      creatorId,
    )

    return right(assignors)
  }
}
