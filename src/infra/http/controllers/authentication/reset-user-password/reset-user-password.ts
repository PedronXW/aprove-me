import { ResetUserPasswordService } from '@/domain/application/services/user/reset-user-password'
import { z } from 'zod'

const resetUserPasswordZodSchema = z.object({
  validatorCode: z.string(),
  password: z.string(),
})

export class ResetUserPasswordController {
  constructor(
    private readonly resetUserPasswordService: ResetUserPasswordService,
  ) {}

  async handle(req, res): Promise<Response> {
    const { validatorCode, password } = resetUserPasswordZodSchema.parse(
      req.body,
    )

    const code = await this.resetUserPasswordService.execute({
      id: validatorCode,
      password,
    })

    if (code.isLeft()) {
      return res.status(400).send({ error: code.value.message })
    }

    return res.status(204).send()
  }
}
