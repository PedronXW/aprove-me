import { InactivePayableError } from './inactive-payable-error'

describe('InactivePayableError', () => {
  it('should be able to create a new InactivePayableError', () => {
    const error = new InactivePayableError()

    expect(error.message).toBe('Inactive payable error')
  })
})
