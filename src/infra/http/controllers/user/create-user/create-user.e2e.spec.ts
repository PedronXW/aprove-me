import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Create User', () => {
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

  it('should be able to create a user', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: expect.any(String),
      active: true,
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      createdAt: expect.any(String),
      updatedAt: null,
    })
  })

  it('should not be able to create a user because a user already exists', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'User already exists',
      error: 'Bad Request',
      statusCode: 400,
    })
  })

  it('should not be able to create a user because a invalid name', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'J',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: { name: 'ZodValidationError', details: expect.any(Object) },
      message: 'Validation failed',
      statusCode: 400,
    })
  })

  it('should not be able to create a user because a invalid password', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: { name: 'ZodValidationError', details: expect.any(Object) },
      message: 'Validation failed',
      statusCode: 400,
    })
  })

  it('should not be able to create a user because a invalid email', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe',
      password: '12345678',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: { name: 'ZodValidationError', details: expect.any(Object) },
      message: 'Validation failed',
      statusCode: 400,
    })
  })
})
