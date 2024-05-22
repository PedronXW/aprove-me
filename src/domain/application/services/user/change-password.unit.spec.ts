import { InMemoryUserRepository } from '@/../test/repositories/InMemoryUserRepository'
import { User } from '@/domain/enterprise/entities/user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { ChangePasswordService } from './change-password'

let sut: ChangePasswordService
let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher

describe('ChangePassword', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangePasswordService(
      inMemoryUserRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should be able to change a user password', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await fakeHasher.hash('any_password'),
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute(
      user.id.getValue(),
      'any_password',
      'new_password',
    )

    expect(result.isRight()).toBe(true)
    expect(
      await fakeHasher.compare(
        'new_password',
        inMemoryUserRepository.users[0].password!.toString(),
      ),
    ).toBe(true)
  })

  it('should be able to not change a user password with a credential error', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await fakeHasher.hash('any_password'),
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute(
      user.id.getValue(),
      'any_p',
      'new_password',
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialError)
  })

  it('should be able to not change a user password with a user not exists error', async () => {
    const result = await sut.execute('any_id', 'any_p', 'new_password')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNonExistsError)
  })
})
