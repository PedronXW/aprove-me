import { Either, left, right } from '@/@shared/either'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../../criptography/hash-generator'
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError'
import { UserRepository } from '../../repositories/user-repository'

interface CreateUserServiceRequest {
  name: string
  email: string
  password: string
}

type CreateUserServiceResponse = Either<UserAlreadyExistsError, User>

@Injectable()
export class CreateUserService {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const userExists = await this.userRepository.findUserByEmail(email)

    if (userExists) {
      return left(new UserAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    })

    const newUser = await this.userRepository.createUser(user)

    return right(newUser)
  }
}
