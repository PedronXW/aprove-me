import { InactiveAssignorError } from './inactive-assignor-error'

describe('InactiveAssignorError', () => {
  it('should be able to create a new InactiveAssignorError', () => {
    const error = new InactiveAssignorError()

    expect(error.message).toBe('Inactive assignor error')
  })
})
