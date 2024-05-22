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
        creatorId: new EntityId(raw.creatorId),
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
      document: assignor.document,
      active: assignor.active,
      creator: {
        connect: {
          id: assignor.creatorId.getValue(),
        },
      },
    }
  }
}
