import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('UpdateAnswerController', () => {
  it('should be able to update an answer', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const { question } = await createQuestionFactory()

    const response = await request(app)
      .post('/answers')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        questionId: question.body.id,
        content: 'Answer content',
      })

    const updateResponse = await request(app)
      .patch(`/answers/${response.body.id}`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        content: 'New Answer content',
      })

    expect(updateResponse.status).toBe(200)

    expect(updateResponse.body).toEqual({
      id: response.body.id,
      questionId: question.body.id,
      content: 'New Answer content',
      authorId: response.body.authorId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})
