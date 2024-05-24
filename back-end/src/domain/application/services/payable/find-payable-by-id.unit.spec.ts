import { PayableFactory } from 'test/factories/unit/PayableFactory'
import { InMemoryPayableRepository } from 'test/repositories/InMemoryPayableRepository'
import { PayableNonExistsError } from '../../errors/payable-non-exists'
import { FindPayableByIdService } from './find-payable-by-id'

let sut: FindPayableByIdService
let inMemoryPayableRepository: InMemoryPayableRepository

describe('Find Payable By ID', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    sut = new FindPayableByIdService(inMemoryPayableRepository)
  })

  it('should be able to find a payable by id', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: payable.id.getValue(),
      assignorId: payable.assignorId.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPayableRepository.payables[0].id).toEqual(payable.id)
  })

  it('should be able to not find a payable because a wrong id', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: 'wrong id',
      assignorId: payable.assignorId.getValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
  })

  it('should be able to not find a payable because a wrong assignor id', async () => {
    const payable = PayableFactory.create({})

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: payable.id.getValue(),
      assignorId: 'wrong id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
  })
})
