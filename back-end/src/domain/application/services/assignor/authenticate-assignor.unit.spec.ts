import { InMemoryAssignorRepository } from '@/../test/repositories/InMemoryAssignorRepository'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AssignorFactory } from 'test/factories/unit/AssignorFactory'
import { WrongCredentialsError } from '../../errors/wrong-credentials-error'
import { AuthenticateAssignorService } from './authenticate-assignor'

let sut: AuthenticateAssignorService
let inMemoryAssignorRepository: InMemoryAssignorRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

describe('AuthenticateAssignor', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateAssignorService(
      inMemoryAssignorRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a assignor', async () => {
    const assignor = await AssignorFactory.create({ password: 'any_password' })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      email: assignor.email,
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAssignorRepository.assignors[0].name).toEqual('any_name')
    expect(result.value).toHaveProperty('token')
  })

  it('should be able to return a wrong credential error caused by a wrong password', async () => {
    const assignor = await AssignorFactory.create({})

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      email: assignor.email,
      password: 'any',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should be able to return a wrong credential error caused by a wrong email', async () => {
    const assignor = await AssignorFactory.create({ password: 'any_password' })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      email: 'any@gmail.com',
      password: 'any_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
