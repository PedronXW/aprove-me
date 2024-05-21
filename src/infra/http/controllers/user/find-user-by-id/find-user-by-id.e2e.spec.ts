import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'

describe('Find User By Id', () => {
  it('should be able to find a user by id', async () => {
    const user = await createAuthenticatedUserOrganizer()

    const findResponse = await request(app)
      .get(`/users`)
      .set('Authorization', `Bearer ${user.authentication.body.token}`)

    expect(findResponse.status).toBe(200)
  })
})
