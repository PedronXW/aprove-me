import { Either, left, right } from '@/@shared/either'
import { User } from '@/domain/enterprise/entities/user'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { UserRepository } from '../../repositories/user-repository'

type UpdateUserServiceResponse = Either<UserNonExistsError, User>

export class UpdateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, name: string): Promise<UpdateUserServiceResponse> {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      return left(new UserNonExistsError())
    }

    const updatedUser = await this.userRepository.updateUser(id, name)

    return right(updatedUser)
  }
}
