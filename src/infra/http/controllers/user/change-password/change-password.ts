import { UserNonExistsError } from '@/domain/application/errors/UserNonExists'
import { WrongCredentialError } from '@/domain/application/errors/WrongCredentialsError'
import { ChangePasswordService } from '@/domain/application/services/user/change-password'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/presenter-user'
import { BadRequestException, Body, Controller, Patch } from '@nestjs/common'
import { z } from 'zod'

const changePasswordDTO = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

export type ChangePasswordDTO = z.infer<typeof changePasswordDTO>

const bodyValidation = new ZodValidationPipe(changePasswordDTO)

@Controller('/users/password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: ChangePasswordDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user

    const { password, newPassword } = body

    const editedUser = await this.changePasswordService.execute(
      sub,
      password,
      newPassword,
    )

    if (editedUser.isLeft()) {
      const error = editedUser.value
      switch (error.constructor) {
        case WrongCredentialError:
          throw new BadRequestException(error.message)
        case UserNonExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return UserPresenter.toHTTP(editedUser.value)
  }
}
