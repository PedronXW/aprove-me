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

    const responsePayable = await request(app.getHttpServer())
      .post('/payables')
      .set('Authorization', `Bearer ${token}`)
      .send({
        value: 1000,
        assignorId: responseAssignor.body.id,
      })

    expect(responsePayable.status).toBe(201)
    expect(responsePayable.body).toEqual({
      id: expect.any(String),
      active: true,
      value: 1000,
      emissionDate: expect.any(String),
      assignorId: responseAssignor.body.id,
      receiverId: expect.any(String),
      received: false,
    })
  })
})
