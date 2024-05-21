import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'
import { InMemoryPayableRepository } from 'test/repositories/InMemoryPayableRepository'
import { PaginationError } from '../../errors/PaginationError'
import { FindPayablesService } from './find-payables'

let sut: FindPayablesService
let inMemoryPayableRepository: InMemoryPayableRepository

describe('Find Payable By Id', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    sut = new FindPayablesService(inMemoryPayableRepository)
  })

  it('should be able to find a payable by id', async () => {
    const payable = Payable.create({
      assignorId: new EntityId('assignor-id'),
      emissionDate: new Date(),
      receiverId: new EntityId('receiver-id'),
      value: 100,
    })

    await inMemoryPayableRepository.createPayable(payable)

    const response = await sut.execute({
      limit: 10,
      page: 1,
      receiverId: 'receiver-id',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      payables: [expect.objectContaining({ id: payable.id })],
      payablesCount: 1,
    })
  })

  it('should not be able to find a payable that does not exist', async () => {
    const response = await sut.execute({
      limit: 10,
      page: 1,
      receiverId: 'receiver-id',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      payables: [],
      payablesCount: 0,
    })
  })

  it('should not be able to find a payable because a pagination error', async () => {
    const response = await sut.execute({
      limit: 10,
      page: 0,
      receiverId: 'receiver-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(PaginationError)
  })
})
