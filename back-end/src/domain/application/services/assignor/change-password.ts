import { Either, left, right } from '@/@shared/either'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../../criptography/hash-comparer'
import { HashGenerator } from '../../criptography/hash-generator'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { InactiveAssignorError } from '../../errors/inactive-assignor-error'
import { WrongCredentialsError } from '../../errors/wrong-credentials-error'
import { AssignorRepository } from '../../repositories/assignor-repository'

type ChangePasswordServiceResponse = Either<
  AssignorNonExistsError | WrongCredentialsError | InactiveAssignorError,
  Assignor
>

@Injectable()
export class ChangePasswordService {
  constructor(
    private assignorRepository: AssignorRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    id: string,
    password: string,
    newPassword: string,
  ): Promise<ChangePasswordServiceResponse> {
    const assignor = await this.assignorRepository.findAssignorById(id)

    if (!assignor) {
      return left(new AssignorNonExistsError())
    }

    if (assignor.active === false) {
      return left(new InactiveAssignorError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      assignor.password!,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const editResult = await this.assignorRepository.changePassword(
      id,
      await this.hashGenerator.hash(newPassword),
    )

    return right(editResult)
  }
}
