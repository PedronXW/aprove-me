import { app } from '@/infra/http/app'
import request from 'supertest'
import {
  createAuthenticatedUserOrganizer,
  createAuthenticatedUserParticipant,
} from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('FindAnswersByQuestionIdController', () => {
  it('should be able to find answers by question id', async () => {
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
      .get(`/answers/question/${question.body.id}`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .query({
        page: 1,
        limit: 10,
      })
      .send()

    expect(findResponse.status).toBe(200)

    expect(findResponse.body).toEqual({
      answers: [
        {
          id: response.body.id,
          questionId: question.body.id,
          content: 'Answer content',
          authorId: response.body.authorId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
      answersCount: 1,
    })
  })

  it('should not be able to find answers by question id because a permission error', async () => {
    const { authentication } = await createAuthenticatedUserParticipant()

    const { question } = await createQuestionFactory()

    await request(app)
      .post('/answers')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        questionId: question.body.id,
        content: 'Answer content',
      })

    const findResponse = await request(app)
      .get(`/answers/question/${question.body.id}`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .query({
        page: 1,
        limit: 10,
      })
      .send()

    expect(findResponse.status).toBe(401)

    expect(findResponse.body).toEqual({
      error: 'User without permission to do that action',
    })
  })
})
