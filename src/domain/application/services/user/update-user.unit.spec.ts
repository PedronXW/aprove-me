import { User } from '@/domain/enterprise/entities/user'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { UserNonExistsError } from '../../errors/UserNonExists'
import { UpdateUserService } from './update-user'

let sut: UpdateUserService
let inMemoryUserRepository: InMemoryUserRepository

describe('EditUser', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new UpdateUserService(inMemoryUserRepository)
  })

  it('should be able to edit a user', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute(user.id.getValue(), 'any_name2')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.users[0].name).toEqual('any_name2')
  })

  it('should be able to not edit a user because a wrong id', async () => {
    const user = User.create({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute('wrong id', 'any_name2')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNonExistsError)
    expect(inMemoryUserRepository.users[0].name).toEqual('any_name')
    expect(inMemoryUserRepository.users[0].email).toEqual('any_email@gmail.com')
  })
})
