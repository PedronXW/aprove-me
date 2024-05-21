import { AuthenticateUserService } from '@/domain/application/services/user/authenticate-user'
import { z } from 'zod'

export const AuthenticateUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type AuthenticateUserDTO = z.infer<typeof AuthenticateUserDTO>

export class AuthenticateUserController {
  constructor(private authenticateUserService: AuthenticateUserService) {}

  async handle(req, res): Promise<Response> {
    const { email, password } = AuthenticateUserDTO.parse(req.body)

    const token = await this.authenticateUserService.execute({
      email,
      password,
    })

    if (token.isLeft()) {
      return res.status(401).send({ error: token.value.message })
    }

    return res.status(200).send({ token: token.value.token })
  }
}
