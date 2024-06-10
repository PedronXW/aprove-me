import { Assignor } from '@/domain/enterprise/entities/assignor'

export type AssignorHTTP = {
  id: string
  name: string
  email: string
  password: string
  document: string
  phone: string
  active: boolean
}

export class AssignorPresenter {
  static toHTTP(assignor: Assignor): AssignorHTTP {
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
