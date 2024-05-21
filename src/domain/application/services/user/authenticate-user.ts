import { Either, left, right } from '@/@shared/either'
import { Encrypter } from '../../criptography/encrypter'
import { HashComparer } from '../../criptography/hash-comparer'
import { InactiveUserError } from '../../errors/InactiveUserError'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { UserRepository } from '../../repositories/user-repository'

type AuthenticateUserServiceRequest = {
  email: string
  password: string
}

type AuthenticateUserServiceResponse = Either<
  WrongCredentialError | InactiveUserError,
  { token: string }
>

export class AuthenticateUserService {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserServiceRequest): Promise<AuthenticateUserServiceResponse> {
    const user = await this.userRepository.findUserByEmail(email)

    if (!user) {
      return left(new WrongCredentialError())
    }

    if (!user.active) {
      return left(new InactiveUserError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      user.password!,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialError())
    }

    const token = await this.encrypter.encrypt({
      id: user.id.getValue(),
    })

    return right({ token })
  }
}
