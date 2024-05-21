import { DeleteUserService } from '@/domain/application/services/user/delete-user'
import { Response } from 'express'
import { z } from 'zod'

const deleteUserZodSchema = z.object({
  id: z.string().uuid(),
})

export class DeleteUserController {
  constructor(private deleteUserService: DeleteUserService) {}

  async handle(req, res): Promise<Response> {
    const { id } = deleteUserZodSchema.parse(req.user)

    const user = await this.deleteUserService.execute({ id })

    if (user.isLeft()) {
      return res.status(400).json({ error: user.value.message })
    }

    return res.status(204).json()
  }
}
