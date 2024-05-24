import { EntityId } from '@/@shared/entities/entity-id'
import { Assignor } from '@/domain/enterprise/entities/assignor'

export class AssignorMapper {
  static toDomain(raw) {
    return Assignor.create(
      {
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        document: raw.document,
        password: raw.password,
        active: raw.active,
      },
      new EntityId(raw.id),
    )
  }

  static toPersistence(assignor: Assignor) {
    return {
      id: assignor.id.getValue(),
      name: assignor.name,
      email: assignor.email,
      phone: assignor.phone,
      password: assignor.password,
      document: assignor.document,
      active: assignor.active,
    }
  }
}
