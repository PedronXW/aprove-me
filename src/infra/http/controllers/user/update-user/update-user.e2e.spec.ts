import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Edit User', () => {
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

  it('should be able to edit a user', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const user = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseUpdate = await request(app.getHttpServer())
      .patch(`/users`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        name: 'John Doe Updated',
      })

    expect(responseUpdate.status).toBe(200)
  })

  it('should not be able to edit a user because a invalid name', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const user = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseUpdate = await request(app.getHttpServer())
      .patch(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        name: 'J',
      })

    expect(responseUpdate.status).toBe(400)
    expect(responseUpdate.body).toEqual({
      errors: { name: 'ZodValidationError', details: expect.any(Object) },
      message: 'Validation failed',
      statusCode: 400,
    })
  })
})
