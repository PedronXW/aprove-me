import { InactiveUserError } from '@/domain/application/errors/InactiveUserError'
import { UserNonExistsError } from '@/domain/application/errors/UserNonExists'
import { DeleteUserService } from '@/domain/application/services/user/delete-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
} from '@nestjs/common'

@Controller('/users')
export class DeleteUserController {
  constructor(private deleteUserService: DeleteUserService) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload) {
    const { sub } = user

    const result = await this.deleteUserService.execute({ id: sub })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UserNonExistsError:
          throw new BadRequestException(error.message)
        case InactiveUserError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
