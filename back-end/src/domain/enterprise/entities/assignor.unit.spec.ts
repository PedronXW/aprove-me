import { Assignor } from './assignor'

describe('Assignor', () => {
  it('should be able to create a new assignor', () => {
    const assignor = Assignor.create({
      name: 'any_name',
      email: 'any_email',
      document: 'any_document',
      phone: 'any_phone',
      password: 'any_password',
    })

    expect(assignor.name).toBe('any_name')
    expect(assignor.email).toBe('any_email')
    expect(assignor.document).toBe('any_document')
    expect(assignor.phone).toBe('any_phone')
    expect(assignor.password).toBe('any_password')
    expect(assignor.active).toBeTruthy()
  })
})
