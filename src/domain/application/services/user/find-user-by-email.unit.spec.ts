import { User } from '@/domain/enterprise/entities/user'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { FindUserByEmailService } from './find-user-by-email'

let sut: FindUserByEmailService
let inMemoryUserRepository: InMemoryUserRepository

describe('Find User By Email', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FindUserByEmailService(inMemoryUserRepository)
  })

  it('should be able to find a user by email', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ email: user.email })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.users[0].name).toEqual('any_name')
  })

  it('should be able to not find a user by email because a wrong email', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ email: 'wrongemail@wrong.com' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNonExistsError)
  })
})
