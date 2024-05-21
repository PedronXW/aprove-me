import { Either, left, right } from '@/@shared/either'
import { User } from '@/domain/enterprise/entities/user'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { UserRepository } from '../../repositories/user-repository'

type FindUserByIdServiceRequest = {
  id: string
}

type FindUserByIdServiceResponse = Either<UserNonExistsError, User>

export class FindUserByIdService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    id,
  }: FindUserByIdServiceRequest): Promise<FindUserByIdServiceResponse> {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      return left(new UserNonExistsError())
    }

    return right(user)
  }
}
