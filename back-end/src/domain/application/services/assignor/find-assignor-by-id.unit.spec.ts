import { AssignorFactory } from 'test/factories/unit/AssignorFactory'
import { InMemoryAssignorRepository } from 'test/repositories/InMemoryAssignorRepository'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { FindAssignorByIdService } from './find-assignor-by-id'

let sut: FindAssignorByIdService
let inMemoryAssignorRepository: InMemoryAssignorRepository

describe('Find Assignor By ID', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    sut = new FindAssignorByIdService(inMemoryAssignorRepository)
  })

  it('should be able to find a assignor by id', async () => {
    const assignor = await AssignorFactory.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: assignor.id.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAssignorRepository.assignors[0].id).toEqual(assignor.id)
  })

  it('should be able to not find a assignor because a wrong id', async () => {
    const assignor = await AssignorFactory.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: 'wrong id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AssignorNonExistsError)
  })
})
