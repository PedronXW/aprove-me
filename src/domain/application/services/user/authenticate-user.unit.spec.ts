import { InMemoryUserRepository } from '@/../test/repositories/InMemoryUserRepository'
import { User } from '@/domain/enterprise/entities/user'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { AuthenticateUserService } from './authenticate-user'

let sut: AuthenticateUserService
let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

describe('AuthenticateUser', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserService(
      inMemoryUserRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a user', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await fakeHasher.hash('any_password'),
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      email: 'any_email@gmail.com',
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.users[0].name).toEqual('any_name')
    expect(result.value).toHaveProperty('token')
  })

  it('should be able to return a wrong credential error caused by a wrong password', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await fakeHasher.hash('any_password'),
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      email: 'any_email@gmail.com',
      password: 'any',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialError)
  })

  it('should be able to return a wrong credential error caused by a wrong email', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await fakeHasher.hash('any_password'),
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      email: 'any@gmail.com',
      password: 'any_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialError)
  })
})
