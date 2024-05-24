import { Assignor } from 'src/domain/enterprise/entities/assignor'

export type FindAssignorsResponse = {
  assignors: Assignor[]
  assignorsCount: number
}

export abstract class AssignorRepository {
  abstract createAssignor(assignor: Assignor): Promise<Assignor>
  abstract updateAssignor(id: string, assignor: Assignor): Promise<Assignor>
  abstract changePassword(id: string, password: string): Promise<Assignor>
  abstract deleteAssignor(id: string): Promise<boolean>
  abstract findAssignorById(id: string): Promise<Assignor>
  abstract findAssignorByEmail(email: string): Promise<Assignor>
}
