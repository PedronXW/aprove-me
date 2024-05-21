import { FindAnswerByIdService } from '@/domain/application/services/answer/find-answer-by-id'
import { AnswerPresenter } from '@/infra/http/presenters/presenter-answer'
import { z } from 'zod'

const findAnswerByIdParamsZodSchema = z.object({
  id: z.string().uuid(),
})

export class FindAnswerByIdController {
  constructor(private findAnswerByIdService: FindAnswerByIdService) {}

  async handle(req, res): Promise<Response> {
    const { id } = findAnswerByIdParamsZodSchema.parse(req.params)

    const answer = await this.findAnswerByIdService.execute(id)

    if (answer.isLeft()) {
      return res.status(404).send({ error: answer.value.message })
    }

    return res.status(200).json(AnswerPresenter.toHTTP(answer.value!))
  }
}
