import { Entity } from '@/@shared/entities/entity'
import { EntityId } from '@/@shared/entities/entity-id'
import { Optional } from '@/@shared/types/optional'

export type PayableProps = {
  value: number
  emissionDate: Date
  active: boolean
  assignorId: EntityId
}

export class Payable extends Entity<PayableProps> {
  get value(): number {
    return this.props.value
  }

  set value(value: number) {
    this.props.value = value
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

  get active(): boolean {
    return this.props.active
  }

  set active(active: boolean) {
    this.props.active = active
  }

  static create(
    props: Optional<PayableProps, 'active' | 'emissionDate'>,
    id?: EntityId,
  ): Payable {
    const payable = new Payable(
      {
        ...props,
        emissionDate: props.emissionDate ?? new Date(),
        active: props.active ?? true,
      },
      id,
    )
    return payable
  }
}
