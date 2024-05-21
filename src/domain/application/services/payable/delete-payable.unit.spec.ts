import { InMemoryPayableRepository } from '@/../test/repositories/InMemoryPayableRepository'
import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'
import { PayableNonExistsError } from '../../errors/PayableNonExists'
import { DeletePayableService } from './delete-payable'

let sut: DeletePayableService
let inMemoryPayableRepository: InMemoryPayableRepository

describe('DeletePayable', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    sut = new DeletePayableService(inMemoryPayableRepository)
  })

  it('should be able to delete a payable', async () => {
    const payable = Payable.create({
      assignorId: new EntityId('assignor-id'),
      emissionDate: new Date(),
      receiverId: new EntityId('receiver-id'),
      value: 100,
    })

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: payable.id.getValue(),
      receiverId: payable.receiverId.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPayableRepository.payables).toHaveLength(0)
  })

  it('should be able to not delete a payable because a wrong id', async () => {
    const payable = Payable.create({
      assignorId: new EntityId('assignor-id'),
      emissionDate: new Date(),
      receiverId: new EntityId('receiver-id'),
      value: 100,
    })

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: 'wrong-id',
      receiverId: payable.receiverId.getValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
  })

  it('should be able to not delete a payable because a wrong receiver id', async () => {
    const payable = Payable.create({
      assignorId: new EntityId('assignor-id'),
      emissionDate: new Date(),
      receiverId: new EntityId('receiver-id'),
      value: 100,
    })

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: payable.id.getValue(),
      receiverId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
  })
})
