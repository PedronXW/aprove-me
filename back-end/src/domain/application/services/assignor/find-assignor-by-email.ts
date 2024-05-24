import { Either, left, right } from '@/@shared/either'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { Injectable } from '@nestjs/common'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { AssignorRepository } from '../../repositories/assignor-repository'

type FindAssignorByEmailServiceRequest = {
  email: string
}

type FindAssignorByEmailServiceResponse = Either<
  AssignorNonExistsError,
  Assignor
>

@Injectable()
export class FindAssignorByEmailService {
  constructor(private assignorRepository: AssignorRepository) {}

  async execute({
    email,
  }: FindAssignorByEmailServiceRequest): Promise<FindAssignorByEmailServiceResponse> {
    const assignor = await this.assignorRepository.findAssignorByEmail(email)

    if (!assignor) {
      return left(new AssignorNonExistsError())
    }

    return right(assignor)
  }
}
