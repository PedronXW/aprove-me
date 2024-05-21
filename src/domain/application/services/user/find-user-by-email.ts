import { Either, left, right } from '@/@shared/either'
import { User } from '@/domain/enterprise/entities/user'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { UserRepository } from '../../repositories/user-repository'

type FindUserByEmailServiceRequest = {
  email: string
}

type FindUserByEmailServiceResponse = Either<UserNonExistsError, User>

export class FindUserByEmailService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
  }: FindUserByEmailServiceRequest): Promise<FindUserByEmailServiceResponse> {
    const user = await this.userRepository.findUserByEmail(email)

    if (!user) {
      return left(new UserNonExistsError())
    }

    return right(user)
  }
}
