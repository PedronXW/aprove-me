import { PayableFactory } from 'test/factories/unit/PayableFactory'
import { PayablePresenter } from './presenter-payable'

describe('PresenterPayable', () => {
  it('should be manipulate a payable to a http response', async () => {
    // Arrange
    const payable = PayableFactory.create({})

    const httpResponse = PayablePresenter.toHTTP(payable)

    expect(httpResponse).toEqual({
      id: payable.id.getValue(),
      value: payable.value,
      emissionDate: payable.emissionDate,
      assignorId: payable.assignorId.getValue(),
      active: payable.active,
    })
  })
})
