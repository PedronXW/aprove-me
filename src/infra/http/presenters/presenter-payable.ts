import { Payable } from '@/domain/enterprise/entities/payable'

export class PayablePresenter {
  static toHTTP(payable: Payable) {
    return {
      id: payable.id.getValue(),
      value: payable.value,
      received: payable.received,
      emissionDate: payable.emissionDate,
      assignorId: payable.assignorId.getValue(),
      receiverId: payable.receiverId.getValue(),
      active: payable.active,
    }
  }
}
