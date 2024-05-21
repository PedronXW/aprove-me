import { Either, right } from '@/@shared/either'
import { EntityId } from '@/@shared/entities/entity-id'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { AssignorRepository } from '../../repositories/assignor-repository'

export type CreateAssignorServiceRequest = {
  name: string
  email: string
  document: string
  phone: string
  creatorId: string
}

export type CreateAssignorServiceResponse = Either<Error, Assignor>

export class CreateAssignorService {
  constructor(private readonly AssignorRepository: AssignorRepository) {}

  async execute({
    name,
    document,
    email,
    creatorId,
    phone,
  }: CreateAssignorServiceRequest): Promise<CreateAssignorServiceResponse> {
    const assignor = Assignor.create({
      name,
      document,
      email,
      phone,
      creatorId: new EntityId(creatorId),
    })

    return right(await this.AssignorRepository.createAssignor(assignor))
  }
}
