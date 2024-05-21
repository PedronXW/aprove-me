import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('FindAnswerByIdController', () => {
  it('should be able to find an answer by id', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const { question } = await createQuestionFactory()

    const response = await request(app)
      .post('/answers')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        questionId: question.body.id,
        content: 'Answer content',
      })

    const findResponse = await request(app)
      .get(`/answers/${response.body.id}`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    expect(findResponse.status).toBe(200)

    expect(findResponse.body).toEqual({
      id: response.body.id,
      questionId: question.body.id,
      content: 'Answer content',
      authorId: response.body.authorId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})
