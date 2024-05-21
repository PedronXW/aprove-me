import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('DeleteAnswerController', () => {
  it('should be able to delete an answer', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const { question } = await createQuestionFactory()

    const response = await request(app)
      .post('/answers')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        questionId: question.body.id,
        content: 'Answer content',
      })

    const deleteResponse = await request(app)
      .delete(`/answers/${response.body.id}`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send()

    expect(deleteResponse.status).toBe(204)
  })
})
