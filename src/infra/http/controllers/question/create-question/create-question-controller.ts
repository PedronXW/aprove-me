import { CreateQuestionService } from '@/domain/application/services/question/create-question'
import { QuestionPresenter } from '@/infra/http/presenters/presenter-question'
import { z } from 'zod'

const createQuestionDTO = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

const createQuestionZodAuthSchema = z.object({
  id: z.string().uuid(),
})

const createQuestionZodPermissionSchema = z.object({
  type: z.enum(['ORGANIZER', 'PARTICIPANT']),
})

export class CreateQuestionController {
  constructor(private createQuestionService: CreateQuestionService) {}

  async handle(req, res): Promise<Response> {
    const { title, content } = createQuestionDTO.parse(req.body)
    const { id } = createQuestionZodAuthSchema.parse(req.user)
    const { type } = createQuestionZodPermissionSchema.parse(req.permission)

    const question = await this.createQuestionService.execute({
      title,
      content,
      authorType: type,
      authorId: id,
    })

    if (question.isLeft()) {
      return res.status(401).send({ error: question.value.message })
    }

    return res.status(201).send(QuestionPresenter.toHTTP(question.value!))
  }
}
