import { EntityId } from '@/@shared/entities/entity-id'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { User } from '@/domain/enterprise/entities/user'
import { InMemoryAssignorRepository } from 'test/repositories/InMemoryAssignorRepository'
import { InMemoryPayableRepository } from 'test/repositories/InMemoryPayableRepository'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { CreatePayableService } from './create-payable'

let sut: CreatePayableService
let inMemoryPayableRepository: InMemoryPayableRepository
let inMemoryAssignorRepository: InMemoryAssignorRepository
let inMemoryUserRepository: InMemoryUserRepository

describe('Create Payable', () => {
  beforeEach(() => {
    inMemoryPayableRepository = new InMemoryPayableRepository()
    inMemoryAssignorRepository = new InMemoryAssignorRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new CreatePayableService(
      inMemoryPayableRepository,
      inMemoryAssignorRepository,
      inMemoryUserRepository,
    )
  })

  it('should be able to create a new payable', async () => {
    inMemoryAssignorRepository.createAssignor(
      Assignor.create(
        {
          name: 'John Doe',
          email: 'johndoe@email.com',
          document: '12345678910',
          phone: '12345678910',
          active: true,
          creatorId: new EntityId('receiver-id'),
        },
        new EntityId('assignor-id'),
      ),
    )

    console.log(inMemoryAssignorRepository.assignors)

    inMemoryUserRepository.createUser(
      User.create(
        {
          name: 'John Doe',
          email: 'johndoe@email.com',
          password: '12345678',
          active: true,
        },
        new EntityId('receiver-id'),
      ),
    )

    console.log(inMemoryUserRepository.users)

    const response = await sut.execute({
      assignorId: 'assignor-id',
      receiverId: 'receiver-id',
      value: 100,
    })

    console.log(response)

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
