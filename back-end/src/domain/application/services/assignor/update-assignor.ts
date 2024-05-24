import { Either, left, right } from '@/@shared/either'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { Injectable } from '@nestjs/common'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { AssignorRepository } from '../../repositories/assignor-repository'

type EditAssignorServiceRequest = {
  id: string
  name?: string
  email?: string
  document?: string
  phone?: string
}

type UpdateAssignorServiceResponse = Either<AssignorNonExistsError, Assignor>

@Injectable()
export class UpdateAssignorService {
  constructor(private assignorRepository: AssignorRepository) {}

  async execute({
    name,
    email,
    document,
    phone,
    id,
  }: EditAssignorServiceRequest): Promise<UpdateAssignorServiceResponse> {
    const assignor = await this.assignorRepository.findAssignorById(id)

    if (!assignor) {
      return left(new AssignorNonExistsError())
    }

    assignor.name = name ?? assignor.name
    assignor.email = email ?? assignor.email
    assignor.document = document ?? assignor.document
    assignor.phone = phone ?? assignor.phone

    const updatedAssignor = await this.assignorRepository.updateAssignor(
      id,
      assignor,
    )

    return right(updatedAssignor)
  }
}
