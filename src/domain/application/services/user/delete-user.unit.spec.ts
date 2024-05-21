import { InMemoryUserRepository } from '@/../test/repositories/InMemoryUserRepository'
import { User } from '@/domain/enterprise/entities/user'
import { InMemoryCacheRepository } from 'test/cache/InMemoryCacheRepository'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { DeleteUserService } from './delete-user'

let sut: DeleteUserService
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryCacheRepository: InMemoryCacheRepository

describe('DeleteUser', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryCacheRepository = new InMemoryCacheRepository()
    sut = new DeleteUserService(inMemoryUserRepository, inMemoryCacheRepository)
  })

  it('should be able to delete a user', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ id: user.id.getValue() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.users).toHaveLength(0)
  })

  it('should be able to not delete a user because a wrong id', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ id: 'wrong id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNonExistsError)
    expect(inMemoryUserRepository.users).toHaveLength(1)
  })
})
