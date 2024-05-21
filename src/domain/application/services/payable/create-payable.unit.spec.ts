import { InMemoryPayableRepository } from 'test/repositories/InMemoryPayableRepository'
import { CreatePayableService } from './create-payable'

let sut: CreatePayableService
let inMemoryPayableRepository: InMemoryPayableRepository

describe('Create Payable', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    sut = new CreatePayableService(inMemoryPayableRepository)
  })

  it('should be able to create a new payable', async () => {
    const response = await sut.execute({
      assignorId: 'assignor-id',
      emissionDate: new Date(),
      receiverId: 'receiver-id',
      value: 100,
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toHaveProperty('id')
    expect(response.value).toHaveProperty('assignorId')
    expect(response.value).toHaveProperty('emissionDate')
    expect(response.value).toHaveProperty('receiverId')
    expect(response.value).toHaveProperty('value')
    expect(inMemoryPayableRepository.payables).toHaveLength(1)
    expect(inMemoryPayableRepository.payables[0]).toEqual(response.value)
  })
})
