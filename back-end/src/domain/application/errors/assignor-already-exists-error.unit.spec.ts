import { AssignorAlreadyExistsError } from './assignor-already-exists-error'

describe('AssignorAlreadyExistsError', () => {
  it('should be able to create a new AssignorAlreadyExistsError', () => {
    const error = new AssignorAlreadyExistsError()

    expect(error.message).toBe('Assignor already exists')
  })
})
