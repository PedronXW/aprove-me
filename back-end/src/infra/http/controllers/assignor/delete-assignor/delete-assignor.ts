import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { InactiveAssignorError } from '@/domain/application/errors/inactive-assignor-error'
import { DeleteAssignorService } from '@/domain/application/services/assignor/delete-assignor'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import { Controller, Delete, HttpCode, HttpException } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('assignor')
@Controller('/assignor')
export class DeleteAssignorController {
  constructor(private deleteAssignorService: DeleteAssignorService) {}

  @ApiOkResponse({
    description: 'Assignor deleted',
    status: 204,
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'Error deleting assignor',
    status: 400,
    type: ErrorDocsResponse,
  })
  @ApiForbiddenResponse({
    description: 'Assignor does not exist',
    status: 403,
    type: ErrorDocsResponse,
  })
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
          throw new HttpException(error.message, 403)
        case InactiveAssignorError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }
  }
}
