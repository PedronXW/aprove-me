import { Either, left, right } from '@/@shared/either'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../../criptography/hash-comparer'
import { HashGenerator } from '../../criptography/hash-generator'
import { InactiveUserError } from '../../errors/InactiveUserError'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { UserRepository } from '../../repositories/user-repository'

type ChangePasswordServiceResponse = Either<
  UserNonExistsError | WrongCredentialError | InactiveUserError,
  User
>

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    id: string,
    password: string,
    newPassword: string,
  ): Promise<ChangePasswordServiceResponse> {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      return left(new UserNonExistsError())
    }

    if (user.active === false) {
      return left(new InactiveUserError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      user.password!,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialError())
    }

    const editResult = await this.userRepository.changePassword(
      id,
      await this.hashGenerator.hash(newPassword),
    )

    return right(editResult)
  }
}
