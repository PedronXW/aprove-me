import { UpdateQuestionService } from '@/domain/application/services/question/update-question'
import { QuestionPresenter } from '@/infra/http/presenters/presenter-question'
import { z } from 'zod'

const updateQuestionZodParamSchema = z.object({
  id: z.string().uuid(),
})

const updateQuestionZodBodySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
})

const updateQuestionZodSchema = z.object({
  id: z.string().uuid(),
})

export class UpdateQuestionController {
  constructor(private updateQuestionService: UpdateQuestionService) {}

  async handle(req, res): Promise<Response> {
    const { id } = updateQuestionZodParamSchema.parse(req.params)

    const { id: userId } = updateQuestionZodSchema.parse(req.user)

    const { title, content } = updateQuestionZodBodySchema.parse(req.body)

    const question = await this.updateQuestionService.execute({
      userId,
      questionId: id,
      title,
      content,
    })

    if (question.isLeft()) {
      return res.status(404).send({ error: question.value.message })
    }

    return res.status(200).send(QuestionPresenter.toHTTP(question.value!))
  }
}
