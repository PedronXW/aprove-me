import { Payable } from '@/domain/enterprise/entities/payable'

export type PayableHTTP = {
  id: string
  value: number
  emissionDate: Date
  assignorId: string
  active: boolean
}

export class PayablePresenter {
  static toHTTP(payable: Payable): PayableHTTP {
    return {
      id: payable.id.getValue(),
      value: payable.value,
      emissionDate: payable.emissionDate,
      assignorId: payable.assignorId.getValue(),
      active: payable.active,
    }
  }
}
