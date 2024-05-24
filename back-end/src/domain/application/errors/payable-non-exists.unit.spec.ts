import { PayableNonExistsError } from './payable-non-exists'

describe('PayableNonExistsError', () => {
  it('should be able to create a new PayableNonExistsError', () => {
    const error = new PayableNonExistsError()

    expect(error.message).toBe('Payable non exists')
  })
})
