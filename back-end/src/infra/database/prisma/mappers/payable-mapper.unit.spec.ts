import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'
import { PayableMapper } from './payable-mapper'

describe('PayableMapper', () => {
  it('should map from raw to domain', () => {
    // Arrange
    const raw = {
      id: '1',
      value: 100,
      emissionDate: new Date(),
      assignorId: 'any_assignor_id',
      active: true,
    }

    // Act
    const result = PayableMapper.toDomain(raw)

    // Assert
    expect(result).toEqual(
      Payable.create(
        {
          value: 100,
          emissionDate: raw.emissionDate,
          assignorId: new EntityId('any_assignor_id'),
          active: true,
        },
        new EntityId('1'),
      ),
    )
  })

  it('should map from domain to persistence', () => {
    // Arrange
    const payable = Payable.create(
      {
        value: 100,
        emissionDate: new Date(),
        assignorId: new EntityId('any_assign_id'),
        active: true,
      },
      new EntityId('1'),
    )

    // Act
    const result = PayableMapper.toPersistence(payable)

    // Assert
    expect(result).toEqual({
      id: '1',
      value: 100,
      emissionDate: payable.emissionDate,
      active: true,
      assignor: {
        connect: {
          id: 'any_assign_id',
        },
      },
    })
  })
})
