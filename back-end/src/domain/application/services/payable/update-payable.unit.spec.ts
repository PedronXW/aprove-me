import { InMemoryPayableRepository } from '@/../test/repositories/InMemoryPayableRepository'
import { PayableFactory } from 'test/factories/unit/PayableFactory'
import { PayableNonExistsError } from '../../errors/payable-non-exists'
import { UpdatePayableService } from './update-payable'

let sut: UpdatePayableService
let inMemoryPayableRepository: InMemoryPayableRepository

describe('UpdatePayable', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    sut = new UpdatePayableService(inMemoryPayableRepository)
  })

  it('should be able to update a payable', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: payable.id.getValue(),
      assignorId: payable.assignorId.getValue(),
      value: 200,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
    expect(inMemoryPayableRepository.payables[0].value).toEqual(200)
  })

  it('should be able to not update a payable because a wrong id', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: 'wrong-id',
      assignorId: payable.assignorId.getValue(),
      value: 200,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
    expect(inMemoryPayableRepository.payables[0].value).toEqual(100)
  })

  it('should be able to not update a payable because a wrong assignor id', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: payable.id.getValue(),
      assignorId: 'wrong-id',
      value: 200,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
    expect(inMemoryPayableRepository.payables[0].value).toEqual(100)
  })
})
