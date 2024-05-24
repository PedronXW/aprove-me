import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'

export class PayableMapper {
  static toDomain(raw) {
    return Payable.create(
      {
        value: raw.value,
        active: raw.active,
        assignorId: new EntityId(raw.assignorId),
        emissionDate: raw.emissionDate,
      },
      new EntityId(raw.id),
    )
  }

  static toPersistence(payable: Payable) {
    return {
      id: payable.id.getValue(),
      value: payable.value,
      active: payable.active,
      emissionDate: payable.emissionDate,
      assignor: {
        connect: {
          id: payable.assignorId.getValue(),
        },
      },
    }
  }
}
