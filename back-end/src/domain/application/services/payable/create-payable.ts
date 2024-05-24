import { Either, left, right } from '@/@shared/either'
import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'
import { Injectable } from '@nestjs/common'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { InactiveAssignorError } from '../../errors/inactive-assignor-error'
import { AssignorRepository } from '../../repositories/assignor-repository'
import { PayableRepository } from '../../repositories/payable-repository'

export type CreatePayableServiceRequest = {
  value: number
  assignorId: string
  emissionDate: Date
}

export type CreatePayableServiceResponse = Either<
  InactiveAssignorError | AssignorNonExistsError,
  Payable
>

@Injectable()
export class CreatePayableService {
  constructor(
    private payableRepository: PayableRepository,
    private assignorRepository: AssignorRepository,
  ) {}

  async execute({
    value,
    emissionDate,
    assignorId,
  }: CreatePayableServiceRequest): Promise<CreatePayableServiceResponse> {
    const assignor = await this.assignorRepository.findAssignorById(assignorId)

    if (!assignor) {
      return left(new AssignorNonExistsError())
    }

    if (assignor.active === false) {
      return left(new InactiveAssignorError())
    }

    const payable = Payable.create({
      value,
      assignorId: new EntityId(assignorId),
      emissionDate,
    })

    return right(await this.payableRepository.createPayable(payable))
  }
}
