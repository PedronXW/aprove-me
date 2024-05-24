import { InMemoryPayableRepository } from '@/../test/repositories/InMemoryPayableRepository'
import { PayableFactory } from 'test/factories/unit/PayableFactory'
import { PayableNonExistsError } from '../../errors/payable-non-exists'
import { DeletePayableService } from './delete-payable'

let sut: DeletePayableService
let inMemoryPayableRepository: InMemoryPayableRepository

describe('DeletePayable', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    sut = new DeletePayableService(inMemoryPayableRepository)
  })

  it('should be able to delete a payable', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: payable.id.getValue(),
      assignorId: payable.assignorId.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPayableRepository.payables).toHaveLength(0)
  })

  it('should be able to not delete a payable because a wrong id', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: 'wrong-id',
      assignorId: payable.assignorId.getValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
  })

  it('should be able to not delete a payable because a wrong assignor id', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: payable.id.getValue(),
      assignorId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
  })
})
