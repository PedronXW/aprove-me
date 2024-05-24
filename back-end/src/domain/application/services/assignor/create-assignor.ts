import { Either, left, right } from '@/@shared/either'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../../criptography/hash-generator'
import { AssignorAlreadyExistsError } from '../../errors/assignor-already-exists-error'
import { AssignorRepository } from '../../repositories/assignor-repository'

export type CreateAssignorServiceRequest = {
  name: string
  email: string
  password: string
  document: string
  phone: string
}

export type CreateAssignorServiceResponse = Either<
  AssignorAlreadyExistsError,
  Assignor
>

@Injectable()
export class CreateAssignorService {
  constructor(
    private AssignorRepository: AssignorRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    document,
    email,
    password,
    phone,
  }: CreateAssignorServiceRequest): Promise<CreateAssignorServiceResponse> {
    const assignorAlreadyExists =
      await this.AssignorRepository.findAssignorByEmail(email)

    if (assignorAlreadyExists) {
      return left(new AssignorAlreadyExistsError())
    }

    const assignor = Assignor.create({
      name,
      document,
      password: await this.hashGenerator.hash(password),
      email,
      phone,
    })

    return right(await this.AssignorRepository.createAssignor(assignor))
  }
}
