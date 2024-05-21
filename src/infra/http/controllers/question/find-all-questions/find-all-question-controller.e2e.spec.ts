import { app } from '@/infra/http/app'
import request from 'supertest'
import { createAuthenticatedUserOrganizer } from 'test/factories/e2e/authenticated-user'
import { createQuestionFactory } from 'test/factories/e2e/question'

describe('FindAllQuestionController', () => {
  it('should be able to find all questions with a false result to answered question', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const { question } = await createQuestionFactory()

    const response = await request(app)
      .get(`/questions`)
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .query({
        page: 1,
        limit: 10,
      })
      .send()

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      questions: [
        {
          id: question.body.id,
          title: question.body.title,
          content: question.body.content,
          authorId: question.body.authorId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          answeredByCurrentUser: false,
          slug: expect.any(String),
        },
      ],
      questionsCount: 1,
    })
  })

  it('should be able to find all questions with a true result to answered question', async () => {
    await createAuthenticatedUserOrganizer()

    const { question } = await createQuestionFactory()

    const { authentication: authenticationSecondAccount } =
      await createAuthenticatedUserOrganizer()

    await request(app)
      .post('/answers')
      .set('Authorization', `Bearer ${authenticationSecondAccount.body.token}`)
      .send({
        questionId: question.body.id,
        content: 'Answer content',
      })

    const response = await request(app)
      .get(`/questions`)
      .set('Authorization', `Bearer ${authenticationSecondAccount.body.token}`)
      .query({
        page: 1,
        limit: 10,
      })
      .send()

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      questions: [
        {
          id: question.body.id,
          title: question.body.title,
          content: question.body.content,
          authorId: question.body.authorId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          answeredByCurrentUser: true,
          slug: expect.any(String),
        },
      ],
      questionsCount: 1,
    })
  })
})
