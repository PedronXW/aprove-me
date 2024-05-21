import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('FindAnswerByAuthorIdInASpecificQuestionController', () => {
  it('should be able to find an answer by author id in a specific question', async () => {
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
      .get(`/answers/question/${question.body.id}/specific`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    expect(findResponse.status).toBe(200)
    expect(findResponse.body).toEqual({
      id: expect.any(String),
      questionId: question.body.id,
      content: 'Answer content',
      authorId: response.body.authorId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})
