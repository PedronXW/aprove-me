import { InMemoryAssignorRepository } from '@/../test/repositories/InMemoryAssignorRepository'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { DeleteAssignorService } from './delete-assignor'

let sut: DeleteAssignorService
let inMemoryAssignorRepository: InMemoryAssignorRepository

describe('DeleteAssignor', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    sut = new DeleteAssignorService(inMemoryAssignorRepository)
  })

  it('should be able to delete a assignor', async () => {
    const assignor = Assignor.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      password: 'any_password',
      document: 'any_document',
      phone: 'any_phone_number',
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: assignor.id.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAssignorRepository.assignors).toHaveLength(0)
  })

  it('should be able to not delete a assignor because a wrong id', async () => {
    const assignor = Assignor.create({
      name: 'any_name',
      email: 'anyemail@email.com',
      document: 'any_document',
      password: 'any_password',
      phone: 'any_phone_number',
    })

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({
      id: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AssignorNonExistsError)
    expect(inMemoryAssignorRepository.assignors).toHaveLength(1)
  })
})
