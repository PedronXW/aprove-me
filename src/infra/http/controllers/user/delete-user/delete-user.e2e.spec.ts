import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Delete User', () => {
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

  it('should be able to delete a user', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const user = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const response = await request(app.getHttpServer())
      .delete(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${user.body.token}`)
      .send()

    expect(response.status).toBe(204)
  })

  it('should be able to not edit a user because the user is deleted', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const authentication = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'johndoe@johndoe.com',
        password: '12345678',
      })

    const response = await request(app.getHttpServer())
      .delete(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    const responseUpdate = await request(app.getHttpServer())
      .patch(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        name: 'John Doe2',
      })

    expect(response.status).toBe(204)
    expect(responseUpdate.body).toEqual({
      error: 'Bad Request',
      message: 'User is inactive',
      statusCode: 400,
    })
  })

  it('should be able to not authenticate a user because the user is deleted', async () => {
    const user = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const authentication = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'johndoe@johndoe.com',
        password: '12345678',
      })

    const response = await request(app.getHttpServer())
      .delete(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    const responseUpdate = await request(app.getHttpServer())
      .post(`/sessions`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        email: user.body.email,
        password: '12345678',
      })

    expect(response.status).toBe(204)
    expect(responseUpdate.body).toEqual({
      error: 'Bad Request',
      message: 'User is inactive',
      statusCode: 400,
    })
  })
})
