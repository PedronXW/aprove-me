import { WrongCredentialsError } from './wrong-credentials-error'

describe('WrongCredentialsError', () => {
  it('should be able to create a new WrongCredentialsError', () => {
    const error = new WrongCredentialsError()

    expect(error.message).toBe('Wrong credentials')
  })
})
