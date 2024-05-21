import { PermissionError } from '@/domain/application/errors/PermissionError'
import { FindAnswersByQuestionIdService } from '@/domain/application/services/answer/find-answer-by-question-id'
import { AnswerPresenter } from '@/infra/http/presenters/presenter-answer'
import { z } from 'zod'

const findAnswersByQuestionIdQuerySchema = z.object({
  page: z.string().transform(Number),
  limit: z.string().transform(Number),
})

const findAnswersByQuestionIdParamsSchema = z.object({
  id: z.string(),
})

const findAnswersByQuestionIdPermissionSchema = z.object({
  type: z.enum(['ORGANIZER', 'PARTICIPANT']),
})

const findAnswersByQuestionIdAuthorSchema = z.object({
  id: z.string().uuid(),
})

export class FindAnswersByQuestionIdController {
  constructor(
    private findAnswersByQuestionIdUseCase: FindAnswersByQuestionIdService,
  ) {}

  async handle(req, res): Promise<Response> {
    const { page, limit } = findAnswersByQuestionIdQuerySchema.parse(req.query)

    const { id } = findAnswersByQuestionIdParamsSchema.parse(req.params)

    const { type } = findAnswersByQuestionIdPermissionSchema.parse(
      req.permission,
    )

    const { id: authorId } = findAnswersByQuestionIdAuthorSchema.parse(req.user)

    const answers = await this.findAnswersByQuestionIdUseCase.execute({
      questionId: id,
      page,
      authorId,
      authorType: type,
      limit,
    })

    if (answers.isLeft() && answers.value instanceof PermissionError) {
      return res.status(401).send({ error: answers.value.message })
    } else if (answers.isLeft()) {
      return res.status(400).send({ error: answers.value.message })
    }

    return res.status(200).json({
      answers: answers.value.answers.map(AnswerPresenter.toHTTP),
      answersCount: answers.value.answersCount,
    })
  }
}
