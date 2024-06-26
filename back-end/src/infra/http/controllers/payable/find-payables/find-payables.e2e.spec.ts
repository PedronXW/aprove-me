import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('FindPayables', () => {
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

  it('should be able to find every payable created by the assignor with a session', async () => {
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

    await request(app.getHttpServer())
      .post('/payable')
      .set('Authorization', `Bearer ${body.token}`)
      .send({
        value: 1000,
        emissionDate: '2024-06-13T18:26:50.421Z',
      })

    const responseSearch = await request(app.getHttpServer())
      .get('/payable')
      .set('Authorization', `Bearer ${body.token}`)
      .query({
        page: 1,
        limit: 10,
      })
      .send()

    expect(responseSearch.status).toBe(200)
    expect(responseSearch.body).toEqual({
      payables: [expect.any(Object)],
      payablesCount: 1,
    })
    expect(responseSearch.body.payables[0]).toEqual({
      id: expect.any(String),
      value: 1000,
      emissionDate: expect.any(String),
      assignorId: expect.any(String),
      active: true,
    })
  })
})
