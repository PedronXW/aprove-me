import {
  AssignorRepository,
  FindAssignorsResponse,
} from '@/domain/application/repositories/assignor-repository'
import { Assignor } from '@/domain/enterprise/entities/assignor'

export class InMemoryAssignorRepository implements AssignorRepository {
  public assignors: Assignor[] = []

  async createAssignor(assignor: Assignor): Promise<Assignor> {
    this.assignors.push(assignor)
    return assignor
  }

  async findAssignorById(
    id: string,
    creatorId: string,
  ): Promise<Assignor | undefined> {
    return this.assignors.find(
      (assignor) =>
        assignor.id.getValue() === id &&
        assignor.creatorId.getValue() === creatorId,
    )
  }

  async updateAssignor(
    id: string,
    editedAssignor: Assignor,
  ): Promise<Assignor> {
    const assignorIndex = this.assignors.findIndex(
      (assignor) => assignor.id.getValue() === id,
    )

    this.assignors[assignorIndex] = editedAssignor

    return editedAssignor
  }

  async deleteAssignor(id: string): Promise<boolean> {
    const assignorIndex = this.assignors.findIndex(
      (assignor) => assignor.id.getValue() === id,
    )

    this.assignors.splice(assignorIndex, 1)

    return (
      this.assignors.findIndex((assignor) => assignor.id.getValue() === id) ===
      -1
    )
  }

  async findAssignors(
    page: number,
    limit: number,
    creatorId: string,
  ): Promise<FindAssignorsResponse> {
    const startIndex = (page - 1) * limit

    const endIndex = page * limit

    return {
      assignors: this.assignors
        .filter((payable) => payable.creatorId.getValue() === creatorId)
        .slice(startIndex, endIndex),
      assignorsCount: this.assignors.filter(
        (payable) => payable.creatorId.getValue() === creatorId,
      ).length,
    }
  }
}
