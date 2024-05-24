import { AssignorFactory } from 'test/factories/unit/AssignorFactory'
import { AssignorPresenter } from './presenter-assignor'

describe('PresenterAssignor', () => {
  it('should be manipulate a assignor to a http response', async () => {
    // Arrange
    const assignor = await AssignorFactory.create({})

    const httpResponse = AssignorPresenter.toHTTP(assignor)

    expect(httpResponse).toEqual({
      id: assignor.id.getValue(),
      name: assignor.name,
      email: assignor.email,
      password: assignor.password,
      document: assignor.document,
      phone: assignor.phone,
      active: assignor.active,
    })
  })
})
