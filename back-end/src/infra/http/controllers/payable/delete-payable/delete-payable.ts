import { InactivePayableError } from '@/domain/application/errors/inactive-payable-error'
import { PayableNonExistsError } from '@/domain/application/errors/payable-non-exists'
import { DeletePayableService } from '@/domain/application/services/payable/delete-payable'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import {
  Controller,
  Delete,
  HttpCode,
  HttpException,
  Param,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@ApiTags('payable')
@Controller('/payable')
export class DeletePayableController {
  constructor(private deletePayableService: DeletePayableService) {}

  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Payable id',
  })
  @ApiOkResponse({
    description: 'Payable deleted',
    status: 204,
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'Error deleting a payable',
    status: 400,
    type: ErrorDocsResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    status: 401,
    type: ErrorDocsResponse,
  })
  @ApiForbiddenResponse({
    description: 'Payable does not exist',
    status: 403,
    type: ErrorDocsResponse,
  })
  @Delete('/:id')
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const { sub } = user

    const result = await this.deletePayableService.execute({
      id,
      assignorId: sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case PayableNonExistsError:
          throw new HttpException(error.message, 403)
        case InactivePayableError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }
  }
}
