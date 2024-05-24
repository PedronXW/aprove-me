import { EntityId } from '@/@shared/entities/entity-id'
import { Payable, PayableProps } from '@/domain/enterprise/entities/payable'

export class PayableFactory {
  static create(props: Partial<PayableProps>, id?: EntityId) {
    return Payable.create(
      {
        assignorId: props.assignorId || new EntityId('assignor-id'),
        emissionDate: props.emissionDate || new Date(),
        value: props.value || 100,
        active: props.active || true,
      },
      id || new EntityId('payable-id'),
    )
  }
}
