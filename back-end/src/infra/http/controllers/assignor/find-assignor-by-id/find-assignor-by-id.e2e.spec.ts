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

  it('should be able to find a assignor', async () => {
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

    const responseFindAssignor = await request(app.getHttpServer())
      .get('/assignor')
      .set('Authorization', `Bearer ${body.token}`)
      .send()

    expect(responseFindAssignor.status).toBe(200)
    expect(responseFindAssignor.body).toEqual({
      assignor: {
        id: expect.any(String),
        name: 'John Doe',
        email: 'johndoe@johndoe.com',
        document: '12345678910',
        phone: '12345678910',
        password: expect.any(String),
        active: true,
      },
    })
  })
})
