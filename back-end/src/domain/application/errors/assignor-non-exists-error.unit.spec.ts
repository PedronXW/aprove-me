import { AssignorNonExistsError } from './assignor-non-exists-error'

describe('AssignorNonExistsError', () => {
  it('should be able to create a new AssignorNonExistsError', () => {
    const error = new AssignorNonExistsError()

    expect(error.message).toBe('Assignor non exists')
  })
})
