import { AssignorRepository } from '@/domain/application/repositories/assignor-repository'
import { Assignor } from '@/domain/enterprise/entities/assignor'

export class InMemoryAssignorRepository implements AssignorRepository {
  public assignors: Assignor[] = []

  async createAssignor(assignor: Assignor): Promise<Assignor> {
    this.assignors.push(assignor)
    return assignor
  }

  async findAssignorById(id: string): Promise<Assignor | undefined> {
    return this.assignors.find((assignor) => assignor.id.getValue() === id)
  }

  async changePassword(id: string, password: string): Promise<Assignor> {
    const assignorIndex = this.assignors.findIndex(
      (c) => c.id.getValue() === id,
    )

    this.assignors[assignorIndex].password = password

    return this.assignors[assignorIndex]
  }

  async findAssignorByEmail(email: string): Promise<Assignor | null> {
    const assignor = this.assignors.find((c) => c.email === email)

    if (!assignor) return null

    return assignor
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
}
