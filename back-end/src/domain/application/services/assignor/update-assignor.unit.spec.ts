import { InMemoryAssignorRepository } from '@/../test/repositories/InMemoryAssignorRepository'
import { AssignorFactory } from 'test/factories/unit/AssignorFactory'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { UpdateAssignorService } from './update-assignor'

let sut: UpdateAssignorService
let inMemoryAssignorRepository: InMemoryAssignorRepository

describe('UpdateAssignor', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    sut = new UpdateAssignorService(inMemoryAssignorRepository)
  })

  it('should be able to update a assignor', async () => {
    const assignor = await AssignorFactory.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: assignor.id.getValue(),
      name: 'new_name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAssignorRepository.assignors).toHaveLength(1)
    expect(inMemoryAssignorRepository.assignors[0].name).toEqual('new_name')
  })

  it('should be able to not update a assignor because a wrong id', async () => {
    const assignor = await AssignorFactory.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: 'wrong-id',
      name: 'new_name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AssignorNonExistsError)
    expect(inMemoryAssignorRepository.assignors).toHaveLength(1)
    expect(inMemoryAssignorRepository.assignors[0].name).toEqual('any_name')
  })
})
