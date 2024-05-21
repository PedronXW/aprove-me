import { InMemoryUserRepository } from '@/../test/repositories/InMemoryUserRepository'
import { User } from '@/domain/enterprise/entities/user'
import { Crypto } from '@/infra/cryptography/crypto'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { AuthenticateUserService } from './authenticate-user'

let sut: AuthenticateUserService
let inMemoryUserRepository: InMemoryUserRepository
let crypto: Crypto
let encrypter: Encrypter

describe('AuthenticateUser', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    crypto = new Crypto()
    encrypter = new Encrypter()
    sut = new AuthenticateUserService(inMemoryUserRepository, crypto, encrypter)
  })

  it('should be able to authenticate a user', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
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
      password: await crypto.hash('any_password'),
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
      password: await crypto.hash('any_password'),
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
