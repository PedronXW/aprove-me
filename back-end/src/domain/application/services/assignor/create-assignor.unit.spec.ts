import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { InMemoryAssignorRepository } from 'test/repositories/InMemoryAssignorRepository'
import { HashGenerator } from '../../criptography/hash-generator'
import { CreateAssignorService } from './create-assignor'

let sut: CreateAssignorService
let inMemoryAssignorRepository: InMemoryAssignorRepository
let hashGenerator: HashGenerator

describe('Create Assignor', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    hashGenerator = new BcryptHasher()
    sut = new CreateAssignorService(inMemoryAssignorRepository, hashGenerator)
  })

  it('should be able to create a new assignor', async () => {
    const response = await sut.execute({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      password: 'any_password',
      phone: 'any_phone_number',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryAssignorRepository.assignors).toHaveLength(1)
    expect(inMemoryAssignorRepository.assignors[0]).toEqual(response.value)
  })
})
