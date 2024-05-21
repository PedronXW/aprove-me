import { Assignor } from 'src/domain/enterprise/entities/assignor'

export type FindAssignorsResponse = {
  assignors: Assignor[]
  assignorsCount: number
}

export abstract class AssignorRepository {
  abstract createAssignor(assignor: Assignor): Promise<Assignor>
  abstract updateAssignor(id: string, assignor: Assignor): Promise<Assignor>
  abstract deleteAssignor(id: string): Promise<boolean>
  abstract findAssignorById(id: string, creatorId: string): Promise<Assignor>
  abstract findAssignors(
    page: number,
    limit: number,
    creatorId: string,
  ): Promise<FindAssignorsResponse>
}
