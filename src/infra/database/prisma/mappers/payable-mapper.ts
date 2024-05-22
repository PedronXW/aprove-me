import { EntityId } from '@/@shared/entities/entity-id'
import { Payable } from '@/domain/enterprise/entities/payable'

export class PayableMapper {
  static toDomain(raw) {
    return Payable.create(
      {
        value: raw.value,
        active: raw.active,
        received: raw.received,
        receiverId: new EntityId(raw.receiverId),
        assignorId: new EntityId(raw.assignorId),
        emissionDate: raw.emissionDate.toString(),
      },
      new EntityId(raw.id),
    )
  }

  static toPersistence(payable: Payable) {
    return {
      id: payable.id.getValue(),
      value: payable.value,
      active: payable.active,
      received: payable.received,
      emissionDate: payable.emissionDate,
      receiver: {
        connect: {
          id: payable.receiverId.getValue(),
        },
      },
      assignor: {
        connect: {
          id: payable.assignorId.getValue(),
        },
      },
    }
  }
}
