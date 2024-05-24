import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../../criptography/encrypter'
import { HashComparer } from '../../criptography/hash-comparer'
import { InactiveAssignorError } from '../../errors/inactive-assignor-error'
import { WrongCredentialsError } from '../../errors/wrong-credentials-error'
import { AssignorRepository } from '../../repositories/assignor-repository'

type AuthenticateAssignorServiceRequest = {
  email: string
  password: string
}

type AuthenticateAssignorServiceResponse = Either<
  WrongCredentialsError | InactiveAssignorError,
  { token: string }
>

@Injectable()
export class AuthenticateAssignorService {
  constructor(
    private assignorRepository: AssignorRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAssignorServiceRequest): Promise<AuthenticateAssignorServiceResponse> {
    const assignor = await this.assignorRepository.findAssignorByEmail(email)

    if (!assignor) {
      return left(new WrongCredentialsError())
    }

    if (!assignor.active) {
      return left(new InactiveAssignorError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      assignor.password!,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const token = await this.encrypter.encrypt({
      sub: assignor.id.getValue(),
    })

    return right({ token })
  }
}
