import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from './payable'

describe('Payable', () => {
  it('should be able to create a new payable', () => {
    const payable = Payable.create({
      assignorId: new EntityId('assignor-id'),
      emissionDate: new Date(),
      value: 100,
    })

    expect(payable.assignorId.getValue()).toBe('assignor-id')
    expect(payable.emissionDate).toBeInstanceOf(Date)
    expect(payable.value).toBe(100)
    expect(payable.active).toBe(true)
  })
})
