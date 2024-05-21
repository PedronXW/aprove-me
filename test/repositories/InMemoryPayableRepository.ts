import {
  FindPayablesResponse,
  PayableRepository,
} from '@/domain/application/repositories/payable-repository'
import { Payable } from '@/domain/enterprise/entities/payable'

export class InMemoryPayableRepository implements PayableRepository {
  public payables: Payable[] = []

  async createPayable(payable: Payable): Promise<Payable> {
    this.payables.push(payable)
    return payable
  }

  async findPayableById(
    id: string,
    receiverId: string,
  ): Promise<Payable | undefined> {
    return this.payables.find(
      (payable) =>
        payable.id.getValue() === id &&
        payable.receiverId.getValue() === receiverId,
    )
  }

  async updatePayable(id: string, editedPayable: Payable): Promise<Payable> {
    const payableIndex = this.payables.findIndex(
      (payable) => payable.id.getValue() === id,
    )

    this.payables[payableIndex] = editedPayable

    return editedPayable
  }

  async deletePayable(id: string): Promise<boolean> {
    const payableIndex = this.payables.findIndex(
      (payable) => payable.id.getValue() === id,
    )

    this.payables.splice(payableIndex, 1)

    return (
      this.payables.findIndex((payable) => payable.id.getValue() === id) === -1
    )
  }

  async findPayables(
    page: number,
    limit: number,
    receiverId: string,
  ): Promise<FindPayablesResponse> {
    const startIndex = (page - 1) * limit

    const endIndex = page * limit

    return {
      payables: this.payables
        .filter((payable) => payable.receiverId.getValue() === receiverId)
        .slice(startIndex, endIndex),
      payablesCount: this.payables.filter(
        (payable) => payable.receiverId.getValue() === receiverId,
      ).length,
    }
  }
}
