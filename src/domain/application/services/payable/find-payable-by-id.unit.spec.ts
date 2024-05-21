import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'
import { InMemoryPayableRepository } from 'test/repositories/InMemoryPayableRepository'
import { PayableNonExistsError } from '../../errors/PayableNonExists'
import { FindPayableByIdService } from './find-payable-by-id'

let sut: FindPayableByIdService
let inMemoryPayableRepository: InMemoryPayableRepository

describe('Find Payable By ID', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    sut = new FindPayableByIdService(inMemoryPayableRepository)
  })

  it('should be able to find a payable by id', async () => {
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
    expect(inMemoryPayableRepository.payables[0].id).toEqual(payable.id)
  })

  it('should be able to not find a payable because a wrong id', async () => {
    const payable = Payable.create({
      assignorId: new EntityId('assignor-id'),
      emissionDate: new Date(),
      receiverId: new EntityId('receiver-id'),
      value: 100,
    })

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: 'wrong id',
      receiverId: payable.receiverId.getValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
  })

  it('should be able to not find a payable because a wrong receiver id', async () => {
    const payable = Payable.create({
      assignorId: new EntityId('assignor-id'),
      emissionDate: new Date(),
      receiverId: new EntityId('receiver-id'),
      value: 100,
    })

    await inMemoryPayableRepository.createPayable(payable)

    const result = await sut.execute({
      id: payable.id.getValue(),
      receiverId: 'wrong id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PayableNonExistsError)
  })
})
