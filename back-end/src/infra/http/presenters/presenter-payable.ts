import { Payable } from '@/domain/enterprise/entities/payable'

export class PayablePresenter {
  static toHTTP(payable: Payable) {
    return {
      id: payable.id.getValue(),
      value: payable.value,
      emissionDate: payable.emissionDate,
      assignorId: payable.assignorId.getValue(),
      active: payable.active,
    }
  }
}
