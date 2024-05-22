import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Authentication', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to authenticate a user', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate a user because a wrong email', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'wrongemail@email.com',
      password: '12345678',
    })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      error: 'Unauthorized',
      message: 'Wrong credentials',
      statusCode: 401,
    })
  })

  it('should not be able to authenticate a user because a wrong password', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: 'wrongpassword',
    })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      error: 'Unauthorized',
      message: 'Wrong credentials',
      statusCode: 401,
    })
  })
})
