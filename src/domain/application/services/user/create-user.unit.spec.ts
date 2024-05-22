import { InMemoryUserRepository } from '@/../test/repositories/InMemoryUserRepository'
import { User } from '@/domain/enterprise/entities/user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError'
import { CreateUserService } from './create-user'

let sut: CreateUserService
let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher

describe('CreateUser', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateUserService(inMemoryUserRepository, fakeHasher)
  })

  it('should be able to create a user', async () => {
    const result = await sut.execute({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.users[0].name).toEqual('any_name')
  })

  it('should not be able to create a user with the same email', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      password: 'any_password',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      name: 'any_name',
      email: 'anyemail@email.com',
      password: 'any_password',
    })

    expect(inMemoryUserRepository.users).toHaveLength(1)
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
