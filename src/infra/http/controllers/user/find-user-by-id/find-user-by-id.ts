import { UserNonExistsError } from '@/domain/application/errors/UserNonExists'
import { FindUserByIdService } from '@/domain/application/services/user/find-user-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { UserPresenter } from '@/infra/http/presenters/presenter-user'
import { BadRequestException, Controller, Get } from '@nestjs/common'

@Controller('users')
export class FindUserByIdController {
  constructor(private readonly findUserByIdService: FindUserByIdService) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub } = user

    const receivedUser = await this.findUserByIdService.execute({ id: sub })

    if (receivedUser.isLeft()) {
      const error = receivedUser.value
      switch (error.constructor) {
        case UserNonExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { user: UserPresenter.toHTTP(receivedUser.value) }
  }
}
