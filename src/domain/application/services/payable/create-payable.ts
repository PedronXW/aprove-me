import { Either, left, right } from '@/@shared/either'
import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'
import { Injectable } from '@nestjs/common'
import { AssignorNonExistsError } from '../../errors/AssignorNonExistsError'
import { InactiveAssignorError } from '../../errors/InactiveAssignorError'
import { InactiveUserError } from '../../errors/InactiveUserError'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { AssignorRepository } from '../../repositories/assignor-repository'
import { PayableRepository } from '../../repositories/payable-repository'
import { UserRepository } from '../../repositories/user-repository'

export type CreatePayableServiceRequest = {
  value: number
  emissionDate: Date
  assignorId: string
  receiverId: string
}

export type CreatePayableServiceResponse = Either<
  | UserNonExistsError
  | InactiveUserError
  | InactiveAssignorError
  | AssignorNonExistsError,
  Payable
>

@Injectable()
export class CreatePayableService {
  constructor(
    private payableRepository: PayableRepository,
    private assignorRepository: AssignorRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    value,
    emissionDate,
    assignorId,
    receiverId,
  }: CreatePayableServiceRequest): Promise<CreatePayableServiceResponse> {
    const assignor = await this.assignorRepository.findAssignorById(
      assignorId,
      receiverId,
    )

    if (!assignor) {
      return left(new AssignorNonExistsError())
    }

    if (assignor.active === false) {
      return left(new InactiveAssignorError())
    }

    const receiver = await this.userRepository.findUserById(receiverId)

    if (!receiver) {
      return left(new UserNonExistsError())
    }

    if (receiver.active === false) {
      return left(new InactiveUserError())
    }

    const payable = Payable.create({
      value,
      emissionDate,
      assignorId: new EntityId(assignorId),
      receiverId: new EntityId(receiverId),
    })

    return right(await this.payableRepository.createPayable(payable))
  }
}
