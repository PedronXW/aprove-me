import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'

describe('Edit User', () => {
  it('should be able to edit a user', async () => {
    const user = await createAuthenticatedUserOrganizer()

    const responseUpdate = await request(app)
      .put(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${user.authentication.body.token}`)
      .send({
        name: 'John Doe2',
      })

    expect(responseUpdate.status).toBe(200)
  })

  it('should not be able to edit a user because a invalid name', async () => {
    const user = await createAuthenticatedUserOrganizer()

    const responseUpdate = await request(app)
      .put(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${user.authentication.body.token}`)
      .send({
        name: 'J',
      })

    expect(responseUpdate.status).toBe(400)
    expect(responseUpdate.body).toEqual({
      error: ['name - String must contain at least 2 character(s)'],
    })
  })
})
