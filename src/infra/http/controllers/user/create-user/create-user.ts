import { UserAlreadyExistsError } from '@/domain/application/errors/UserAlreadyExistsError'
import { CreateUserService } from '@/domain/application/services/user/create-user'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/presenter-user'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createUserDTO = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export type CreateUserDTO = z.infer<typeof createUserDTO>

const bodyValidation = new ZodValidationPipe(createUserDTO)

@Public()
@Controller('/users')
export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateUserDTO) {
    const { name, email, password } = body

    const user = await this.createUserService.execute({
      name,
      email,
      password,
    })

    if (user.isLeft()) {
      const error = user.value
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return UserPresenter.toHTTP(user.value)
  }
}
