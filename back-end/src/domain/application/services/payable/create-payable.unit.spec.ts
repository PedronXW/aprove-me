import { EntityId } from '@/@shared/entities/entity-id'
import { AssignorFactory } from 'test/factories/unit/AssignorFactory'
import { InMemoryAssignorRepository } from 'test/repositories/InMemoryAssignorRepository'
import { InMemoryPayableRepository } from 'test/repositories/InMemoryPayableRepository'
import { CreatePayableService } from './create-payable'

let sut: CreatePayableService
let inMemoryPayableRepository: InMemoryPayableRepository
let inMemoryAssignorRepository: InMemoryAssignorRepository

describe('Create Payable', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    sut = new CreatePayableService(
      inMemoryPayableRepository,
      inMemoryAssignorRepository,
    )
  })

  it('should be able to create a new payable', async () => {
    inMemoryAssignorRepository.createAssignor(
      await AssignorFactory.create({}, new EntityId('assignor-id')),
    )

    const response = await sut.execute({
      assignorId: 'assignor-id',
      emissionDate: new Date(),
      value: 100,
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
    expect(inMemoryPayableRepository.payables[0]).toEqual(response.value)
  })
})
