import { CreateAnswerService } from '@/domain/application/services/answer/create-answer'
import { AnswerPresenter } from '@/infra/http/presenters/presenter-answer'
import { z } from 'zod'

const createAnswerZodSchema = z.object({
  questionId: z.string(),
  content: z.string().min(3),
})

const createAnswerZodQuerySchema = z.object({
  id: z.string().uuid(),
})

export class CreateAnswerController {
  constructor(private createAnswerService: CreateAnswerService) {}

  async handle(req, res): Promise<Response> {
    const { questionId, content } = createAnswerZodSchema.parse(req.body)
    const { id } = createAnswerZodQuerySchema.parse(req.user)

    const answer = await this.createAnswerService.execute({
      questionId,
      content,
      authorId: id,
    })

    if (answer.isLeft()) {
      return res.status(400).send({ error: answer.value.message })
    }

    return res.status(201).send(AnswerPresenter.toHTTP(answer.value))
  }
}
