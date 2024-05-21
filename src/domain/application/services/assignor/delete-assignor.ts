import { Either, left, right } from '@/@shared/either'
import { AssignorNonExistsError } from '../../errors/AssignorNonExists'
import { AssignorRepository } from '../../repositories/assignor-repository'

type DeleteAssignorServiceRequest = {
  id: string
  creatorId: string
}

type DeleteAssignorServiceResponse = Either<AssignorNonExistsError, boolean>

export class DeleteAssignorService {
  constructor(private assignorRepository: AssignorRepository) {}

  async execute({
    id,
    creatorId,
  }: DeleteAssignorServiceRequest): Promise<DeleteAssignorServiceResponse> {
    const assignor = await this.assignorRepository.findAssignorById(
      id,
      creatorId,
    )

    if (!assignor) {
      return left(new AssignorNonExistsError())
    }

    const result = await this.assignorRepository.deleteAssignor(id)

    return right(result)
  }
}
