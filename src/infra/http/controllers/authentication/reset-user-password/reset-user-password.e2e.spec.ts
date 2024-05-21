import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'

describe('Reset User Password', () => {
  it('should be able to reset a user password', async () => {
    const { user } = await createAuthenticatedUserOrganizer()

    const getResetPassword = await request(app)
      .post('/sessions/reset-password')
      .send({
        email: user.body.email,
      })

    const response = await request(app).put('/sessions/reset-password').send({
      validatorCode: getResetPassword.body.validatorCode,
      password: '123456789',
    })

    expect(response.status).toBe(204)
  })

  it('should not be able to reset a user password because a invalid signature jwt', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      type: 'ORGANIZER',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const response = await request(app).put('/sessions/reset-password').send({
      validatorCode:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', // invalid signature
      password: '123456789',
    })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error - invalid signature',
    })
  })

  it('should not be able to reset a user password because a invalid id', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      type: 'ORGANIZER',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const response = await request(app).put('/sessions/reset-password').send({
      validatorCode: 'invalid-id', // invalid id - not a jwt
      password: '123456789',
    })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal Server Error - jwt malformed',
    })
  })
})
