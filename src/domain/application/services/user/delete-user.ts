import { Either, left, right } from '@/@shared/either'
import { CacheRepository } from '../../cache/cache-repository'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { UserRepository } from '../../repositories/user-repository'

type DeleteUserServiceRequest = {
  id: string
}

type DeleteUserServiceResponse = Either<UserNonExistsError, boolean>

export class DeleteUserService {
  constructor(
    private userRepository: UserRepository,
    private cacheRepository: CacheRepository,
  ) {}

  async execute({
    id,
  }: DeleteUserServiceRequest): Promise<DeleteUserServiceResponse> {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      return left(new UserNonExistsError())
    }

    const result = await this.userRepository.deleteUser(id)

    if (result) {
      await this.cacheRepository.set(`user:${id}`, JSON.stringify(new Date()))
    }

    return right(result)
  }
}
