import { EntityId } from '@/@shared/entities/entity-id'
import { Assignor } from '@/domain/enterprise/entities/assignor'
import { AssignorMapper } from './assignor-mapper'

describe('AssignorMapper', () => {
  it('should map from raw to domain', () => {
    // Arrange
    const raw = {
      id: '1',
      name: 'any_name',
      email: 'any_email',
      phone: 'any_phone',
      document: 'any_document',
      password: 'any_password',
      active: true,
    }

    // Act
    const result = AssignorMapper.toDomain(raw)

    // Assert
    expect(result).toEqual(
      Assignor.create(
        {
          name: 'any_name',
          email: 'any_email',
          phone: 'any_phone',
          document: 'any_document',
          password: 'any_password',
          active: true,
        },
        new EntityId('1'),
      ),
    )
  })

  it('should map from domain to persistence', () => {
    // Arrange
    const assignor = Assignor.create(
      {
        name: 'any_name',
        email: 'any_email',
        phone: 'any_phone',
        document: 'any_document',
        password: 'any_password',
        active: true,
      },
      new EntityId('1'),
    )

    // Act
    const result = AssignorMapper.toPersistence(assignor)

    // Assert
    expect(result).toEqual({
      id: '1',
      name: 'any_name',
      email: 'any_email',
      phone: 'any_phone',
      password: 'any_password',
      document: 'any_document',
      active: true,
    })
  })
})
