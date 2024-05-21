import { app } from '@/infra/http/app'
import request from 'supertest'
import {
  createAuthenticatedUserOrganizer,
  createAuthenticatedUserParticipant,
} from 'test/factories/e2e/authenticated-user'

describe('CreateQuestionController', () => {
  it('should be able to create a new question', async () => {
    const { authentication } = await createAuthenticatedUserOrganizer()

    const question = await request(app)
      .post('/questions')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        title: 'Question title',
        content: 'Question content',
      })

    expect(question.status).toBe(201)
    expect(question.body).toEqual({
      id: expect.any(String),
      title: 'Question title',
      content: 'Question content',
      authorId: expect.any(String),
      createdAt: expect.any(String),
      slug: expect.any(String),
      updatedAt: expect.any(String),
    })
  })

  it('should not be able to create a new question because a permission error', async () => {
    const { authentication } = await createAuthenticatedUserParticipant()

    const question = await request(app)
      .post('/questions')
      .set('Authorization', `Bearer ${authentication.body.token}`)
      .send({
        title: 'Question title',
        content: 'Question content',
      })

    expect(question.status).toBe(401)
    expect(question.body).toEqual({
      error: 'User without permission to do that action',
    })
  })
})
