import { Entity } from '@/@shared/entities/entity'
import { EntityId } from '@/@shared/entities/entity-id'
import { Optional } from '@/@shared/types/optional'

type AssignorProps = {
  name: string
  email: string
  document: string
  active: boolean
  creatorId: EntityId
  phone: string
}

export class Assignor extends Entity<AssignorProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email(): string {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get document(): string {
    return this.props.document
  }

  set document(document: string) {
    this.props.document = document
  }

  get phone(): string {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
  }

  get active(): boolean {
    return this.props.active
  }

  set active(active: boolean) {
    this.props.active = active
  }

  get creatorId(): EntityId {
    return this.props.creatorId
  }

  set creatorId(creatorId: EntityId) {
    this.props.creatorId = creatorId
  }

  static create(
    props: Optional<AssignorProps, 'active'>,
    id?: EntityId,
  ): Assignor {
    const assignor = new Assignor(
      {
        ...props,
        active: props.active ?? true,
      },
      id,
    )
    return assignor
  }
}
