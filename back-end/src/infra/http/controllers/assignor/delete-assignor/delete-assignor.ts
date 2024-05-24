import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { InactiveAssignorError } from '@/domain/application/errors/inactive-assignor-error'
import { DeleteAssignorService } from '@/domain/application/services/assignor/delete-assignor'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
} from '@nestjs/common'

@Controller('/assignor')
export class DeleteAssignorController {
  constructor(private deleteAssignorService: DeleteAssignorService) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload) {
    const { sub } = user

    const result = await this.deleteAssignorService.execute({
      id: sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case AssignorNonExistsError:
          throw new BadRequestException(error.message)
        case InactiveAssignorError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
