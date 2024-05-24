import { AssignorFactory } from 'test/factories/unit/AssignorFactory'
import { InMemoryAssignorRepository } from 'test/repositories/InMemoryAssignorRepository'
import { AssignorNonExistsError } from '../../errors/assignor-non-exists-error'
import { FindAssignorByEmailService } from './find-assignor-by-email'

let sut: FindAssignorByEmailService
let inMemoryAssignorRepository: InMemoryAssignorRepository

describe('Find Assignor By Email', () => {
  beforeEach(() => {
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    sut = new FindAssignorByEmailService(inMemoryAssignorRepository)
  })

  it('should be able to find a assignor by email', async () => {
    const assignor = await AssignorFactory.create({})

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({ email: assignor.email })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAssignorRepository.assignors[0].name).toEqual(assignor.name)
  })

  it('should be able to not find a assignor by email because a wrong email', async () => {
    const assignor = await AssignorFactory.create({})

    await inMemoryAssignorRepository.createAssignor(assignor)

    const result = await sut.execute({ email: 'wrongemail@wrong.com' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AssignorNonExistsError)
  })
})
