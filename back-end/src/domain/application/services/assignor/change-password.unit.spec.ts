import { InMemoryAssignorRepository } from '@/../test/repositories/InMemoryAssignorRepository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AssignorFactory } from 'test/factories/unit/AssignorFactory'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { WrongCredentialsError } from '../../errors/wrong-credentials-error'
import { ChangePasswordService } from './change-password'

let sut: ChangePasswordService
let inMemoryAssignorRepository: InMemoryAssignorRepository
let fakeHasher: FakeHasher

describe('ChangePassword', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangePasswordService(
      inMemoryAssignorRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should be able to change a assignor password', async () => {
    const assignor = await AssignorFactory.create({})

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute(
      assignor.id.getValue(),
      'any_password',
      'new_password',
    )

    expect(result.isRight()).toBe(true)
    expect(
      await fakeHasher.compare(
        'new_password',
        inMemoryAssignorRepository.assignors[0].password!.toString(),
      ),
    ).toBe(true)
  })

  it('should be able to not change a assignor password with a credential error', async () => {
    const assignor = await AssignorFactory.create({ password: 'any_password' })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute(
      assignor.id.getValue(),
      'any_p',
      'new_password',
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should be able to not change a assignor password with a assignor not exists error', async () => {
    const result = await sut.execute('any_id', 'any_p', 'new_password')

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AssignorNonExistsError)
  })
})
