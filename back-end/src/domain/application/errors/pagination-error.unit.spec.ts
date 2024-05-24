import { PaginationError } from './pagination-error'

describe('PaginationError', () => {
  it('should be able to create a new PaginationError', () => {
    const error = new PaginationError()

    expect(error.message).toBe(
      'Invalid pagination parameters, verify if page and limit are integers and greater than 0',
    )
  })
})
