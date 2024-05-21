import { User } from '@/domain/enterprise/entities/user'
import { Crypto } from '@/infra/cryptography/crypto'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { env } from '@/infra/env'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { SendResetPasswordService } from './send-reset-password'

let sut: SendResetPasswordService
let inMemoryUserRepository: InMemoryUserRepository
let crypto: Crypto
let encrypter: Encrypter
describe('SendResetPassword', () => {
  beforeEach(() => {
    crypto = new Crypto()
    encrypter = new Encrypter()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new SendResetPasswordService(inMemoryUserRepository, encrypter)
  })

  it('should be able to send a reset password email', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ email: user.email })

    const encryptedId = await encrypter.decrypt(
      result.value as string,
      env.RESET_PASSWORD_SECRET,
    )

    expect(result.isRight()).toBe(true)
    expect(encryptedId).toEqual({
      id: user.id.getValue(),
    })
  })

  it('should not be able to send a reset password email because a invalid email', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ email: 'invalidemail@email.com' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNonExistsError)
  })
})
