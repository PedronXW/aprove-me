import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Create Payable', () => {
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

  it('should be able to create a payable', async () => {
    const responseAssignor = await request(app.getHttpServer())
      .post('/assignor')
      .send({
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
        emissionDate: '2024-06-13T18:26:50.421Z',
      })

    expect(responsePayable.status).toBe(201)
    expect(responsePayable.body).toEqual({
      payable: {
        id: expect.any(String),
        active: true,
        value: 1000,
        emissionDate: expect.any(String),
        assignorId: responseAssignor.body.assignor.id,
      },
    })
  })
})
