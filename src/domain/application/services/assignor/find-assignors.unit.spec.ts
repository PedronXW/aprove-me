import { EntityId } from '@/@shared/entities/entity-id'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { InMemoryAssignorRepository } from 'test/repositories/InMemoryAssignorRepository'
import { PaginationError } from '../../errors/PaginationError'
import { FindAssignorsService } from './find-assignors'

let sut: FindAssignorsService
let inMemoryAssignorRepository: InMemoryAssignorRepository

describe('Find Assignor By Id', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    sut = new FindAssignorsService(inMemoryAssignorRepository)
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

    const response = await sut.execute({
      limit: 10,
      page: 1,
      creatorId: 'creator-id',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      assignors: [expect.objectContaining({ id: assignor.id })],
      assignorsCount: 1,
    })
  })

  it('should not be able to find a assignor that does not exist', async () => {
    const assignor = Assignor.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
      creatorId: new EntityId('creator-id'),
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const response = await sut.execute({
      limit: 10,
      page: 1,
      creatorId: 'wrong-id',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      assignors: [],
      assignorsCount: 0,
    })
  })

  it('should not be able to find a assignor because a pagination error', async () => {
    const assignor = Assignor.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
      creatorId: new EntityId('creator-id'),
    })

    await inMemoryAssignorRepository.createAssignor(assignor)
    const response = await sut.execute({
      limit: 10,
      page: 0,
      creatorId: 'receiver-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(PaginationError)
  })
})
