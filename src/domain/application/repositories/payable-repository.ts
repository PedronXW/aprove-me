import { Payable } from 'src/domain/enterprise/entities/payable'

export type FindPayablesResponse = {
  payables: Payable[]
  payablesCount: number
}

export abstract class PayableRepository {
  abstract createPayable(data: Payable): Promise<Payable>
  abstract findPayableById(id: string, receiverId: string): Promise<Payable>
  abstract updatePayable(id: string, editedPayable: Payable): Promise<Payable>
  abstract deletePayable(id: string): Promise<boolean>
  abstract findPayables(
    page: number,
    limit: number,
    receiverId: string,
  ): Promise<FindPayablesResponse>
}
