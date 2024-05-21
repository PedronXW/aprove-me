import { ChangePasswordService } from '@/domain/application/services/user/change-password'
import { UserPresenter } from '@/infra/http/presenters/presenter-user'
import { Response } from 'express'
import { z } from 'zod'

const changePasswordZodBodySchema = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

export type ChangePasswordBodySchema = z.infer<
  typeof changePasswordZodBodySchema
>

const changePasswordZodParamsSchema = z.object({
  id: z.string().uuid(),
})

export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  async handle(req, res): Promise<Response> {
    const { id } = changePasswordZodParamsSchema.parse(req.user)

    const { password, newPassword } = changePasswordZodBodySchema.parse(
      req.body,
    )

    const editedUser = await this.changePasswordService.execute(
      id,
      password,
      newPassword,
    )

    if (editedUser.isLeft()) {
      return res.status(400).send({ error: editedUser.value.message })
    }

    return res.status(200).send(UserPresenter.toHTTP(editedUser.value))
  }
}
