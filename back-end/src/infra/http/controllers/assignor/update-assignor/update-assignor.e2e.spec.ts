import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Update Assignor', () => {
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

  it('should be able to update a assignor', async () => {
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

    const responseUpdateAssignor = await request(app.getHttpServer())
      .patch(`/assignor`)
      .set('Authorization', `Bearer ${body.token}`)
      .send({
        name: 'John Doe2',
      })

    expect(responseAssignor.status).toBe(201)
    expect(responseUpdateAssignor.body).toEqual({
      assignor: {
        id: expect.any(String),
        active: true,
        name: 'John Doe2',
        email: 'johndoe@johndoe.com',
        document: '12345678910',
        phone: '12345678910',
        password: expect.any(String),
      },
    })
  })
})
