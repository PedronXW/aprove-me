import { PermissionError } from './permission-error'

describe('PermissionError', () => {
  it('should be able to create a new PermissionError', () => {
    const error = new PermissionError()

    expect(error.message).toBe('User without permission to do that action')
  })
})
