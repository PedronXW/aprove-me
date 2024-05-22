import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Find User By Id', () => {
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

  it('should be able to find a user by id', async () => {
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

    const findResponse = await request(app.getHttpServer())
      .get(`/users`)
      .set('Authorization', `Bearer ${authentication.body.token}`)

    expect(findResponse.status).toBe(200)
  })
})
