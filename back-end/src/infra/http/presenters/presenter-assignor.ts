import { Assignor } from '@/domain/enterprise/entities/assignor'

export class AssignorPresenter {
  static toHTTP(assignor: Assignor) {
    return {
      id: assignor.id.getValue(),
      name: assignor.name,
      email: assignor.email,
      password: assignor.password,
      document: assignor.document,
      phone: assignor.phone,
      active: assignor.active,
    }
  }
}
