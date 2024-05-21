import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('DeleteQuestionController', () => {
  it('should be able to delete a question', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const { question } = await createQuestionFactory(authentication.body.token)

    const response = await request(app)
      .delete(`/questions/${question.body.id}`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    expect(response.status).toBe(204)
  })

  it('should not be able to delete a question with an invalid id', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const response = await request(app)
      .delete(`/questions/invalid-id`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: ['id - Invalid uuid'],
    })
  })
})
