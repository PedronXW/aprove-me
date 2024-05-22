import { UserNonExistsError } from '@/domain/application/errors/UserNonExists'
import { UpdateUserService } from '@/domain/application/services/user/update-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/presenter-user'
import { BadRequestException, Body, Controller, Patch } from '@nestjs/common'
import { z } from 'zod'

const updateUserDTO = z.object({
  name: z.string().min(2),
})

export type UpdateUserDTO = z.infer<typeof updateUserDTO>

const bodyValidation = new ZodValidationPipe(updateUserDTO)

@Controller('/users')
export class UpdateUserController {
  constructor(private updateUserService: UpdateUserService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: UpdateUserDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { name } = body

    const { sub } = user

    const updatedUser = await this.updateUserService.execute(sub, name)

    if (updatedUser.isLeft()) {
      const error = updatedUser.value
      switch (error.constructor) {
        case UserNonExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return UserPresenter.toHTTP(updatedUser.value)
  }
}
