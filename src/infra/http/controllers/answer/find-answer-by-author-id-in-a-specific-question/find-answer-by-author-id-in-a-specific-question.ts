import { FindAnswerByAuthorIdInASpecificQuestionService } from '@/domain/application/services/answer/find-answer-by-author-id-in-a-specific-question'
import { AnswerPresenter } from '@/infra/http/presenters/presenter-answer'
import { z } from 'zod'

const findAnswerByAuthorIdInASpecificQuestionParamsSchema = z.object({
  id: z.string().uuid(),
})

const findAnswerByAuthorIdInASpecificQuestionAuthSchema = z.object({
  id: z.string().uuid(),
})

export class FindAnswerByAuthorIdInASpecificQuestionController {
  constructor(
    private findAnswerByAuthorIdInASpecificQuestionService: FindAnswerByAuthorIdInASpecificQuestionService,
  ) {}

  async handle(req, res): Promise<Response> {
    const { id: questionId } =
      findAnswerByAuthorIdInASpecificQuestionParamsSchema.parse(req.params)

    const { id: authorId } =
      findAnswerByAuthorIdInASpecificQuestionAuthSchema.parse(req.user)

    const answers =
      await this.findAnswerByAuthorIdInASpecificQuestionService.execute(
        authorId,
        questionId,
      )

    if (answers.isLeft()) {
      return res.status(404).send({ error: answers.value.message })
    }

    return res.status(200).json(AnswerPresenter.toHTTP(answers.value))
  }
}
