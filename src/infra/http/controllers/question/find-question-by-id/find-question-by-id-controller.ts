import { FindQuestionByIdService } from '@/domain/application/services/question/find-question-by-id'
import { QuestionPresenter } from '@/infra/http/presenters/presenter-question'
import { z } from 'zod'

const findQuestionByIdZodParamsSchema = z.object({
  id: z.string().uuid(),
})

const findAllQuestionsZodPassSchema = z.object({
  id: z.string().uuid(),
})

export class FindQuestionByIdController {
  constructor(private findQuestionByIdService: FindQuestionByIdService) {}

  async handle(req, res): Promise<Response> {
    const { id } = findQuestionByIdZodParamsSchema.parse(req.params)

    const { id: authorId } = findAllQuestionsZodPassSchema.parse(req.user)

    const question = await this.findQuestionByIdService.execute(id, authorId)

    if (question.isLeft()) {
      return res.status(404).send({ error: question.value.message })
    }

    return res.status(200).json(QuestionPresenter.toHTTP(question.value!))
  }
}
