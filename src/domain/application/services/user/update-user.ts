import { Either, left, right } from '@/@shared/either'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { InactiveUserError } from '../../errors/InactiveUserError'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { UserRepository } from '../../repositories/user-repository'

type UpdateUserServiceResponse = Either<
  UserNonExistsError | InactiveUserError,
  User
>

@Injectable()
export class UpdateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, name: string): Promise<UpdateUserServiceResponse> {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      return left(new UserNonExistsError())
    }

    if (!user.active) {
      return left(new InactiveUserError())
    }

    const updatedUser = await this.userRepository.updateUser(id, name)

    return right(updatedUser)
  }
}
