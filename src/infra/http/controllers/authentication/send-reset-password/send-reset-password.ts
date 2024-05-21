import { SendResetPasswordService } from '@/domain/application/services/user/send-reset-password'
import { z } from 'zod'

const sendResetPasswordZodSchema = z.object({
  email: z.string(),
})

export class SendResetPasswordController {
  constructor(
    private readonly sendResetPasswordService: SendResetPasswordService,
  ) {}

  async handle(req, res): Promise<Response> {
    const { email } = sendResetPasswordZodSchema.parse(req.body)

    const code = await this.sendResetPasswordService.execute({ email })

    if (code.isLeft()) {
      return res.status(400).send({ error: code.value.message })
    }

    return res.status(200).send({ validatorCode: code.value })
  }
}
