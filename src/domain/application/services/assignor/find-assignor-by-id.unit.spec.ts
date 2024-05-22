import { EntityId } from '@/@shared/entities/entity-id'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { InMemoryAssignorRepository } from 'test/repositories/InMemoryAssignorRepository'
import { AssignorNonExistsError } from '../../errors/AssignorNonExistsError'
import { FindAssignorByIdService } from './find-assignor-by-id'

let sut: FindAssignorByIdService
let inMemoryAssignorRepository: InMemoryAssignorRepository

describe('Find Assignor By ID', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    sut = new FindAssignorByIdService(inMemoryAssignorRepository)
  })

  it('should be able to find a assignor by id', async () => {
    const assignor = Assignor.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
      creatorId: new EntityId('creator-id'),
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: assignor.id.getValue(),
      creatorId: assignor.creatorId.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAssignorRepository.assignors[0].id).toEqual(assignor.id)
  })

  it('should be able to not find a assignor because a wrong id', async () => {
    const assignor = Assignor.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
      creatorId: new EntityId('creator-id'),
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: 'wrong id',
      creatorId: assignor.creatorId.getValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AssignorNonExistsError)
  })

  it('should be able to not find a assignor because a wrong receiver id', async () => {
    const assignor = Assignor.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
      creatorId: new EntityId('creator-id'),
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: assignor.id.getValue(),
      creatorId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AssignorNonExistsError)
  })
})
