import { AssignorNonExistsError } from '@/domain/application/errors/AssignorNonExistsError'
import { InactiveAssignorError } from '@/domain/application/errors/InactiveAssignorError'
import { DeleteAssignorService } from '@/domain/application/services/assignor/delete-assignor'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/assignors')
export class DeleteAssignorController {
  constructor(private deleteAssignorService: DeleteAssignorService) {}

  @Delete('/:id')
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const { sub } = user

    const result = await this.deleteAssignorService.execute({
      id,
      creatorId: sub,
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
