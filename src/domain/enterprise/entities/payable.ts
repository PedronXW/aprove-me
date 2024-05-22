import { Entity } from '@/@shared/entities/entity'
import { EntityId } from '@/@shared/entities/entity-id'
import { Optional } from '@/@shared/types/optional'

type PayableProps = {
  value: number
  received: boolean
  emissionDate: Date
  active: boolean
  assignorId: EntityId
  receiverId: EntityId
}

export class Payable extends Entity<PayableProps> {
  get value(): number {
    return this.props.value
  }

  set value(value: number) {
    this.props.value = value
  }

  get received(): boolean {
    return this.props.received
  }

  set received(received: boolean) {
    this.props.received = received
  }

  get emissionDate(): Date {
    return this.props.emissionDate
  }

  set emissionDate(emissionDate: Date) {
    this.props.emissionDate = emissionDate
  }

  get assignorId(): EntityId {
    return this.props.assignorId
  }

  set assignorId(assignorId: EntityId) {
    this.props.assignorId = assignorId
  }

  get receiverId(): EntityId {
    return this.props.receiverId
  }

  set receiverId(receiverId: EntityId) {
    this.props.receiverId = receiverId
  }

  get active(): boolean {
    return this.props.active
  }

  set active(active: boolean) {
    this.props.active = active
  }

  static create(
    props: Optional<PayableProps, 'received' | 'active' | 'emissionDate'>,
    id?: EntityId,
  ): Payable {
    const payable = new Payable(
      {
        ...props,
        emissionDate: props.emissionDate ?? new Date(),
        received: props.received ?? false,
        active: props.active ?? true,
      },
      id,
    )
    return payable
  }
}
