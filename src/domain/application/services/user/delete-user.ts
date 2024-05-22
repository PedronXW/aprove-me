import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../../cache/cache-repository'
import { InactiveUserError } from '../../errors/InactiveUserError'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { UserRepository } from '../../repositories/user-repository'

type DeleteUserServiceRequest = {
  id: string
}

type DeleteUserServiceResponse = Either<
  UserNonExistsError | InactiveUserError,
  boolean
>

@Injectable()
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

    if (!user.active) {
      return left(new InactiveUserError())
    }

    const result = await this.userRepository.deleteUser(id)

    if (result) {
      await this.cacheRepository.set(`user:${id}`, JSON.stringify(new Date()))
    }

    return right(result)
  }
}
