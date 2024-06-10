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
    await request(app.getHttpServer()).post('/assignor').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
      document: '12345678910',
      phone: '12345678910',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseDeleteAssignor = await request(app.getHttpServer())
      .delete('/assignor')
      .set('Authorization', `Bearer ${body.token}`)
      .send()

    expect(responseDeleteAssignor.status).toBe(204)
  })

  it('should be able to find a deleted assignor', async () => {
    await request(app.getHttpServer()).post('/assignor').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
      document: '12345678910',
      phone: '12345678910',
    })

    const { body } = await request(app.getHttpServer()).post('/session').send({
      email: 'johndoe@johndoe.com',
      password: '12345678',
    })

    const responseDeleteAssignor = await request(app.getHttpServer())
      .delete('/assignor')
      .set('Authorization', `Bearer ${body.token}`)
      .send()

    const responseFindAssignor = await request(app.getHttpServer())
      .get('/assignor')
      .set('Authorization', `Bearer ${body.token}`)
      .send()

    expect(responseDeleteAssignor.status).toBe(204)
    expect(responseFindAssignor.status).toBe(403)
    expect(responseFindAssignor.body).toEqual({
      message: 'Assignor non exists',
      statusCode: 403,
    })
  })
})
