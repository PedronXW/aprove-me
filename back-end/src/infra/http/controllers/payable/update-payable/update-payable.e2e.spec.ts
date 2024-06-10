import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Update Payable', () => {
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

  it('should be able to update a payable', async () => {
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

    const payable = await request(app.getHttpServer())
      .post('/payable')
      .set('Authorization', `Bearer ${body.token}`)
      .send({
        value: 1000,
        emissionDate: new Date(),
      })

    const responseSearch = await request(app.getHttpServer())
      .patch('/payable/' + payable.body.payable.id)
      .set('Authorization', `Bearer ${body.token}`)
      .send({
        value: 2000,
        emissionDate: new Date(),
      })

    expect(responseSearch.status).toBe(200)
    expect(responseSearch.body).toEqual({
      payable: {
        id: expect.any(String),
        value: 2000,
        emissionDate: expect.any(String),
        assignorId: expect.any(String),
        active: true,
      },
    })
  })
})
