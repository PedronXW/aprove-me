import { CreateUserService } from '@/domain/application/services/user/create-user'
import { UserPresenter } from '@/infra/http/presenters/presenter-user'
import { Response } from 'express'
import { z } from 'zod'

const createUserZodSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  type: z.enum(['ORGANIZER', 'PARTICIPANT']),
  password: z.string().min(8),
})

export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  async handle(req, res): Promise<Response> {
    const { name, email, password, type } = createUserZodSchema.parse(req.body)

    const user = await this.createUserService.execute({
      name,
      email,
      type,
      password,
    })

    if (user.isLeft()) {
      return res.status(400).json({ error: user.value.message })
    }

    return res.status(201).json(UserPresenter.toHTTP(user.value))
  }
}
