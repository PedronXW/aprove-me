import { FindQuestionBySlugService } from '@/domain/application/services/question/find-question-by-slug'
import { QuestionPresenter } from '@/infra/http/presenters/presenter-question'
import { z } from 'zod'

const findQuestionBySlugZodParamSchema = z.object({
  slug: z.string(),
})

const findAllQuestionsZodQuerySchema = z.object({
  page: z.string().transform(Number),
  limit: z.string().transform(Number),
})

const findAllQuestionsZodPassSchema = z.object({
  id: z.string().uuid(),
})

export class FindQuestionBySlugController {
  constructor(private findQuestionBySlugService: FindQuestionBySlugService) {}

  async handle(req, res): Promise<Response> {
    const { slug } = findQuestionBySlugZodParamSchema.parse(req.params)

    const { page, limit } = findAllQuestionsZodQuerySchema.parse(req.query)

    const { id } = findAllQuestionsZodPassSchema.parse(req.user)

    const questions = await this.findQuestionBySlugService.execute({
      slug,
      authorId: id,
      page,
      limit,
    })

    if (questions.isLeft()) {
      return res.status(404).send({
        error: questions.value?.message,
      })
    }

    return res.status(200).send({
      questions: questions.value?.questions.map(QuestionPresenter.toHTTP),
      questionsCount: questions.value?.questionsCount,
    })
  }
}
