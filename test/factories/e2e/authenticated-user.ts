import { User } from '@/domain/enterprise/entities/user'
import { app } from '@/infra/http/app'
import { faker } from '@faker-js/faker'
import request from 'supertest'

type AuthenticatedUserFactory = {
  user: { body: User }
  authentication: { body: { token: string } }
  password?: string
}

const createAuthenticatedUserOrganizer =
  async (): Promise<AuthenticatedUserFactory> => {
    const password = faker.internet.password()

    const user = await request(app).post('/users').send({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      type: 'ORGANIZER',
      password,
    })

    const authentication = await request(app).post('/sessions').send({
      email: user.body.email,
      password,
    })

    return {
      user,
      authentication,
      password,
    }
  }

const createAuthenticatedUserParticipant =
  async (): Promise<AuthenticatedUserFactory> => {
    const password = faker.internet.password()

    const user = await request(app).post('/users').send({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      type: 'PARTICIPANT',
      password,
    })

    const authentication = await request(app).post('/sessions').send({
      email: user.body.email,
      password,
    })

    return {
      user,
      authentication,
      password,
    }
  }

export { createAuthenticatedUserOrganizer, createAuthenticatedUserParticipant }
