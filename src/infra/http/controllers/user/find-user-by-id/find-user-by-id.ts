import { FindUserByIdService } from '@/domain/application/services/user/find-user-by-id'
import { UserPresenter } from '@/infra/http/presenters/presenter-user'
import { Response } from 'express'
import { z } from 'zod'

const findUserByIdZodSchema = z.object({
  id: z.string().uuid(),
})

export class FindUserByIdController {
  constructor(private readonly findUserByIdService: FindUserByIdService) {}

  async handle(req, res): Promise<Response> {
    const { id } = findUserByIdZodSchema.parse(req.user)

    const user = await this.findUserByIdService.execute({ id })

    if (user.isLeft()) {
      return res.status(400).send({ error: user.value.message })
    }

    return res.status(200).send({ user: UserPresenter.toHTTP(user.value) })
  }
}
