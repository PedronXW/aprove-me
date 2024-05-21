import { User } from '@/domain/enterprise/entities/user'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { FindUserByIdService } from './find-user-by-id'

let sut: FindUserByIdService
let inMemoryUserRepository: InMemoryUserRepository

describe('Find User By ID', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FindUserByIdService(inMemoryUserRepository)
  })

  it('should be able to find a user by id', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ id: user.id.getValue() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.users[0].name).toEqual('any_name')
  })

  it('should be able to not find a user because a wrong id', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ id: 'wrong id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNonExistsError)
  })
})
