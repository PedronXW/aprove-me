import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'

describe('Change Password', () => {
  it('should be able to change a user password', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      type: 'ORGANIZER',
      password: '12345678',
    })

    const authentication = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseUpdate = await request(app)
      .put(`/users/password`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        password: '12345678',
        newPassword: '123456789',
      })

    expect(responseUpdate.status).toBe(200)
  })

  it('should not be able to change a user password because a invalid password', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      type: 'ORGANIZER',
      password: '12345678',
    })

    const authentication = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseUpdate = await request(app)
      .put(`/users/password`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        password: '123',
        newPassword: '123456789',
      })

    expect(responseUpdate.status).toBe(400)
    expect(responseUpdate.body).toEqual({
      error: ['password - String must contain at least 8 character(s)'],
    })
  })

  it('should not be able to change a user password because a wrong password', async () => {
    const user = await createAuthenticatedUserOrganizer()

    const responseUpdate = await request(app)
      .put(`/users/password`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${user.authentication.body.token}`)
      .send({
        password: 'wrongpassword',
        newPassword: '123456789',
      })

    expect(responseUpdate.status).toBe(400)
    expect(responseUpdate.body).toEqual({
      error: 'Wrong credentials',
    })
  })
})
