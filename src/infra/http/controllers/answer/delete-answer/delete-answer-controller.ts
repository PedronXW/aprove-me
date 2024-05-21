import { DeleteAnswerService } from '@/domain/application/services/answer/delete-answer'
import { z } from 'zod'

const deleteAnswerZodSchema = z.object({
  id: z.string().uuid(),
})

const deleteAnswerZodQuerySchema = z.object({
  id: z.string().uuid(),
})

export class DeleteAnswerController {
  constructor(private deleteAnswerService: DeleteAnswerService) {}

  async handle(req, res): Promise<Response> {
    const { id } = deleteAnswerZodSchema.parse(req.params)

    const { id: userId } = deleteAnswerZodQuerySchema.parse(req.user)

    const isDeleted = await this.deleteAnswerService.execute(id, userId)

    if (isDeleted.isLeft()) {
      return res.status(404).send({ error: isDeleted.value.message })
    }

    return res.status(204).send()
  }
}
