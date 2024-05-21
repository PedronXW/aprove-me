import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('CreateAnswerController', () => {
  it('should be able to create a new answer', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const { question } = await createQuestionFactory()

    const response = await request(app)
      .post('/answers')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        questionId: question.body.id,
        content: 'Answer content',
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      id: expect.any(String),
      questionId: question.body.id,
      content: 'Answer content',
      authorId: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})
