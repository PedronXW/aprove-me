import { InMemoryAssignorRepository } from 'test/repositories/InMemoryAssignorRepository'
import { CreateAssignorService } from './create-assignor'

let sut: CreateAssignorService
let inMemoryAssignorRepository: InMemoryAssignorRepository

describe('Create Assignor', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    sut = new CreateAssignorService(inMemoryAssignorRepository)
  })

  it('should be able to create a new assignor', async () => {
    const response = await sut.execute({
      creatorId: 'creator-id',
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      phone: 'any_phone_number',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toHaveProperty('id')
    expect(response.value).toHaveProperty('creatorId')
    expect(response.value).toHaveProperty('name')
    expect(response.value).toHaveProperty('email')
    expect(response.value).toHaveProperty('document')
    expect(response.value).toHaveProperty('phone')
    expect(inMemoryAssignorRepository.assignors).toHaveLength(1)
    expect(inMemoryAssignorRepository.assignors[0]).toEqual(response.value)
  })
})
