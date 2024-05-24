import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Delete Payable', () => {
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

  it('should be able to delete a payable', async () => {
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

    const responsePayable = await request(app.getHttpServer())
      .post('/payable')
      .set('Authorization', `Bearer ${body.token}`)
      .send({
        value: 1000,
        emissionDate: new Date(),
      })

    const response = await request(app.getHttpServer())
      .delete('/payable/' + responsePayable.body.payable.id)
      .set('Authorization', `Bearer ${body.token}`)
      .send()

    expect(response.status).toBe(204)
  })

  it('should be able to delete a payable and not find after a search', async () => {
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

    const responsePayable = await request(app.getHttpServer())
      .post('/payable')
      .set('Authorization', `Bearer ${body.token}`)
      .send({
        value: 1000,
        emissionDate: new Date(),
      })

    await request(app.getHttpServer())
      .delete('/payable/' + responsePayable.body.payable.id)
      .set('Authorization', `Bearer ${body.token}`)
      .send()

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
      payables: [],
      payablesCount: 0,
    })
  })
})
