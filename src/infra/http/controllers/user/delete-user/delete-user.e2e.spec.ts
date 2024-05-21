import { RedisCacheRepository } from '@/infra/cache/redis-repository'
import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'

describe('Delete User', () => {
  it('should be able to delete a user', async () => {
    const { authentication, user } = await createAuthenticatedUserOrganizer()

    const response = await request(app)
      .delete(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    const cacheRepository = new RedisCacheRepository()
    const userDeleted = await cacheRepository.get('user:' + user.body.id)

    expect(response.status).toBe(204)
    expect(userDeleted).toEqual(expect.any(String))
  })

  it('should be able to not edit a user because the user is deleted', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const response = await request(app)
      .delete(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    const responseUpdate = await request(app)
      .put(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        name: 'John Doe2',
      })

    expect(response.status).toBe(204)
    expect(responseUpdate.body).toEqual({
      error: 'User is inactive',
    })
  })

  it('should be able to not authenticate a user because the user is deleted', async () => {
    const { authentication, user, password } =
      await createAuthenticatedUserOrganizer()

    const response = await request(app)
      .delete(`/users`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    const responseUpdate = await request(app)
      .post(`/sessions`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        email: user.body.email,
        password,
      })

    expect(response.status).toBe(204)
    expect(responseUpdate.body).toEqual({
      error: 'User is inactive',
    })
  })
})
