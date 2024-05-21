import { Either, left, right } from '@/@shared/either'
import { env } from '@/infra/env'
import { Encrypter } from '../../criptography/encrypter'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { UserRepository } from '../../repositories/user-repository'

interface SendResetPasswordServiceRequest {
  email: string
}

type SendResetPasswordServiceResponse = Either<UserNonExistsError, string>

export class SendResetPasswordService {
  constructor(
    private userRepository: UserRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
  }: SendResetPasswordServiceRequest): Promise<SendResetPasswordServiceResponse> {
    const userExists = await this.userRepository.findUserByEmail(email)

    if (!userExists) {
      return left(new UserNonExistsError())
    }

    const encryptedId = await this.encrypter.encrypt(
      { id: userExists.id.getValue() },
      env.RESET_PASSWORD_SECRET,
    )

    return right(encryptedId)
  }
}
