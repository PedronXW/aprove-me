import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('FindQuestionByIdController', () => {
  it('should be able to find a question by id', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const { question } = await createQuestionFactory()

    const response = await request(app)
      .get(`/questions/${question.body.id}`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .query({
        page: 1,
        limit: 10,
      })
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      ...question.body,
      answeredByCurrentUser: false,
    })
  })
})
