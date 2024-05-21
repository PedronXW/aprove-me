import { InMemoryPayableRepository } from '@/../test/repositories/InMemoryPayableRepository'
import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'
import { PayableNonExistsError } from '../../errors/PayableNonExists'
import { UpdatePayableService } from './update-payable'

let sut: UpdatePayableService
let inMemoryPayableRepository: InMemoryPayableRepository

describe('UpdatePayable', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    sut = new UpdatePayableService(inMemoryPayableRepository)
  })

  it('should be able to update a payable', async () => {
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
      value: 200,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
    expect(inMemoryPayableRepository.payables[0].value).toEqual(200)
  })

  it('should be able to not update a payable because a wrong id', async () => {
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
      value: 200,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
    expect(inMemoryPayableRepository.payables[0].value).toEqual(100)
  })

  it('should be able to not update a payable because a wrong receiver id', async () => {
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
      value: 200,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
    expect(inMemoryPayableRepository.payables[0].value).toEqual(100)
  })
})
