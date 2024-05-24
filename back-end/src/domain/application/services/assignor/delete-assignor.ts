import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { InactiveAssignorError } from '../../errors/inactive-assignor-error'
import { AssignorRepository } from '../../repositories/assignor-repository'

type DeleteAssignorServiceRequest = {
  id: string
}

type DeleteAssignorServiceResponse = Either<AssignorNonExistsError, boolean>

@Injectable()
export class DeleteAssignorService {
  constructor(private assignorRepository: AssignorRepository) {}

  async execute({
    id,
  }: DeleteAssignorServiceRequest): Promise<DeleteAssignorServiceResponse> {
    const assignor = await this.assignorRepository.findAssignorById(id)

    if (!assignor) {
      return left(new AssignorNonExistsError())
    }

    if (!assignor.active) {
      return left(new InactiveAssignorError())
    }

    const result = await this.assignorRepository.deleteAssignor(id)

    return right(result)
  }
}
