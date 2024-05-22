import { Either, left, right } from '@/@shared/either'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { Injectable } from '@nestjs/common'
import { AssignorNonExistsError } from '../../errors/AssignorNonExistsError'
import { AssignorRepository } from '../../repositories/assignor-repository'

type FindAssignorByIdServiceRequest = {
  id: string
  creatorId: string
}

type FindAssignorByIdServiceResponse = Either<AssignorNonExistsError, Assignor>

@Injectable()
export class FindAssignorByIdService {
  constructor(private assignorRepository: AssignorRepository) {}

  async execute({
    id,
    creatorId,
  }: FindAssignorByIdServiceRequest): Promise<FindAssignorByIdServiceResponse> {
    const assignor = await this.assignorRepository.findAssignorById(
      id,
      creatorId,
    )

    if (!assignor) {
      return left(new AssignorNonExistsError())
    }

    return right(assignor)
  }
}
