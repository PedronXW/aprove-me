import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'

describe('Send Reset Password Email', () => {
  it('should be able to send a reset password email', async () => {
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

  it('should not be able to send a reset password email because a wrong email', async () => {
    await createAuthenticatedUserOrganizer()

    const sendMail = await request(app).post('/sessions/reset-password').send({
      email: 'wrongemail@wrong.com',
    })

    expect(sendMail.status).toBe(400)
    expect(sendMail.body).toEqual({ error: 'User non exists' })
  })
})
