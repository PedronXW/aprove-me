import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('Create Assignor', () => {
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

  it('should be able to create a assignor', async () => {
    const responseAssignor = await request(app.getHttpServer())
      .post('/assignor')
      .send({
        name: 'John Doe',
        email: 'johndoe@johndoe.com',
        password: '12345678',
        document: '12345678910',
        phone: '12345678910',
      })

    expect(responseAssignor.status).toBe(201)
    expect(responseAssignor.body).toEqual({
      assignor: {
        id: expect.any(String),
        active: true,
        name: 'John Doe',
        password: expect.any(String),
        email: 'johndoe@johndoe.com',
        document: '12345678910',
        phone: '12345678910',
      },
    })
  })
})
