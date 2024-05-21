import { WrongCredentialError } from '@/domain/application/errors/WrongCredentialsError'
import request from 'supertest'
import { app } from '../../../app'

describe('Authentication', () => {
  it('should be able to authenticate a user', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      type: 'ORGANIZER',
      password: '12345678',
    })

    const response = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate a user because a wrong email', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      type: 'ORGANIZER',
      password: '12345678',
    })

    const response = await request(app).post('/sessions').send({
      email: 'wrongemail@email.com',
      password: '12345678',
    })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      error: new WrongCredentialError().message,
    })
  })

  it('should not be able to authenticate a user because a wrong password', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      type: 'ORGANIZER',
      password: '12345678',
    })

    const response = await request(app).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: 'wrongpassword',
    })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      error: new WrongCredentialError().message,
    })
  })
})
