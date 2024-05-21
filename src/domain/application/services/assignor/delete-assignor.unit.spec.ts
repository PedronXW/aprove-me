import { InMemoryAssignorRepository } from '@/../test/repositories/InMemoryAssignorRepository'
import { EntityId } from '@/@shared/entities/entity-id'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { AssignorNonExistsError } from '../../errors/AssignorNonExists'
import { DeleteAssignorService } from './delete-assignor'

let sut: DeleteAssignorService
let inMemoryAssignorRepository: InMemoryAssignorRepository

describe('DeleteAssignor', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    sut = new DeleteAssignorService(inMemoryAssignorRepository)
  })

  it('should be able to delete a assignor', async () => {
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
    expect(inMemoryAssignorRepository.assignors).toHaveLength(0)
  })

  it('should be able to not delete a assignor because a wrong id', async () => {
    const assignor = Assignor.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
      creatorId: new EntityId('creator-id'),
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: 'wrong-id',
      creatorId: assignor.creatorId.getValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AssignorNonExistsError)
    expect(inMemoryAssignorRepository.assignors).toHaveLength(1)
  })

  it('should be able to not delete a assignor because a wrong receiver id', async () => {
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
      creatorId: 'wrong-creator-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AssignorNonExistsError)
    expect(inMemoryAssignorRepository.assignors).toHaveLength(1)
  })
})
