import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('UpdateQuestionController', () => {
  it('should be able to update a question', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const { question } = await createQuestionFactory(authentication.body.token)

    const response = await request(app)
      .patch(`/questions/${question.body.id}`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        title: 'Question title updated',
        content: 'Question content updated',
      })

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      id: question.body.id,
      authorId: question.body.authorId,
      title: 'Question title updated',
      content: 'Question content updated',
      slug: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })
})
