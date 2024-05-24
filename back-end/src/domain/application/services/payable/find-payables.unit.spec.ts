import { PayableFactory } from 'test/factories/unit/PayableFactory'
import { InMemoryPayableRepository } from 'test/repositories/InMemoryPayableRepository'
import { PaginationError } from '../../errors/pagination-error'
import { FindPayablesService } from './find-payables'

let sut: FindPayablesService
let inMemoryPayableRepository: InMemoryPayableRepository

describe('Find Payable By Id', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    sut = new FindPayablesService(inMemoryPayableRepository)
  })

  it('should be able to find a payable by id', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const response = await sut.execute({
      limit: 10,
      page: 1,
      assignorId: payable.assignorId.getValue(),
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
      assignorId: 'assignor-id',
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
      assignorId: 'assignor-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(PaginationError)
  })
})
