import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { WrongCredentialsError } from '@/domain/application/errors/wrong-credentials-error'
import { ChangePasswordService } from '@/domain/application/services/assignor/change-password'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import { BadRequestException, Body, Controller, Patch } from '@nestjs/common'
import { z } from 'zod'

const changePasswordDTO = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

export type ChangePasswordDTO = z.infer<typeof changePasswordDTO>

const bodyValidation = new ZodValidationPipe(changePasswordDTO)

@Controller('/assignor/password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: ChangePasswordDTO,
    @CurrentUser() assignor: UserPayload,
  ) {
    const { sub } = assignor

    const { password, newPassword } = body

    const editedAssignor = await this.changePasswordService.execute(
      sub,
      password,
      newPassword,
    )

    if (editedAssignor.isLeft()) {
      const error = editedAssignor.value
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new BadRequestException(error.message)
        case AssignorNonExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return AssignorPresenter.toHTTP(editedAssignor.value)
  }
}
