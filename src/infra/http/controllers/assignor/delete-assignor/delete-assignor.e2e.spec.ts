import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Delete Assignor', () => {
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

  it('should be able to delete a assignor', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { token } = response.body

    const responseAssignor = await request(app.getHttpServer())
      .post('/assignors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@johndoe.com',
        document: '12345678910',
        phone: '12345678910',
      })

    const responseDeleteAssignor = await request(app.getHttpServer())
      .delete('/assignors/' + responseAssignor.body.id)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(responseDeleteAssignor.status).toBe(204)
  })

  it('should be able to find a deleted assignor', async () => {
    await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const { token } = response.body

    const responseAssignor = await request(app.getHttpServer())
      .post('/assignors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@johndoe.com',
        document: '12345678910',
        phone: '12345678910',
      })

    const responseDeleteAssignor = await request(app.getHttpServer())
      .delete('/assignors/' + responseAssignor.body.id)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const responseFindAssignor = await request(app.getHttpServer())
      .get('/assignors/' + responseAssignor.body.id)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(responseDeleteAssignor.status).toBe(204)
    expect(responseFindAssignor.status).toBe(400)
    expect(responseFindAssignor.body).toEqual({
      message: 'Assignor non exists',
      error: 'Bad Request',
      statusCode: 400,
    })
  })
})
