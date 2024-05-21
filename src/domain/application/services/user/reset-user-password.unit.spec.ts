import { User } from '@/domain/enterprise/entities/user'
import { Crypto } from '@/infra/cryptography/crypto'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { env } from '@/infra/env'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { ResetUserPasswordService } from './reset-user-password'

let sut: ResetUserPasswordService
let inMemoryUserRepository: InMemoryUserRepository
let crypto: Crypto
let encrypter: Encrypter
describe('ResetUserPassword', () => {
  beforeEach(() => {
    crypto = new Crypto()
    encrypter = new Encrypter()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new ResetUserPasswordService(
      inMemoryUserRepository,
      crypto,
      encrypter,
    )
  })

  it('should be able to reset a user password', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryUserRepository.createUser(user)

    const id = await encrypter.encrypt(
      { id: user.id.getValue() },
      env.RESET_PASSWORD_SECRET,
    )

    const result = await sut.execute({
      id,
      password: 'new_password',
    })

    expect(result.isRight()).toBe(true)
    expect(
      await crypto.compare(
        'new_password',
        inMemoryUserRepository.users[0].password!.toString(),
      ),
    ).toEqual(true)
  })

  it('should be able to not reset a user password a wrong id', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryUserRepository.createUser(user)

    const id = await encrypter.encrypt(
      { id: 'wrong id' },
      env.RESET_PASSWORD_SECRET,
    )

    const result = await sut.execute({
      id,
      password: 'new_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNonExistsError)
  })
})
