import { EntityId } from '@/@shared/entities/entity-id'
import { Assignor, AssignorProps } from '@/domain/enterprise/entities/assignor'
import { FakeHasher } from 'test/cryptography/fake-hasher'

export class AssignorFactory {
  static async create(props: Partial<AssignorProps>, id?: EntityId) {
    const fakeHasher = new FakeHasher()
    return Assignor.create(
      {
        name: props.name || 'any_name',
        email: props.email || 'any_email@email.com',
        phone: props.phone || 'any_phone',
        document: props.document || 'any_document',
        password: await fakeHasher.hash(props?.password || 'any_password'),
        active: props.active || true,
      },
      id || new EntityId('assignor-id'),
    )
  }
}
