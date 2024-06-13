import { PayableNonExistsError } from '@/domain/application/errors/payable-non-exists'
import { FindPayableByIdService } from '@/domain/application/services/payable/find-payable-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import { PayablePresenter } from '@/infra/http/presenters/presenter-payable'
import { Controller, Get, HttpException, Param } from '@nestjs/common'
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
export class FindPayableByIdController {
  constructor(
    private readonly findPayableByIdService: FindPayableByIdService,
  ) {}

  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Payable id',
  })
  @ApiOkResponse({
    description: 'Assignor updated',
    status: 200,
    schema: {
      type: 'object',
      properties: {
        payable: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            value: { type: 'number' },
            emissionDate: { type: 'string', format: 'date-time' },
            status: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'Error getting a payable',
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
  @Get('/:id')
  async handle(@Param('id') id: string, @CurrentUser() payable: UserPayload) {
    const { sub } = payable

    const receivedPayable = await this.findPayableByIdService.execute({
      id,
      assignorId: sub,
    })

    if (receivedPayable.isLeft()) {
      const error = receivedPayable.value
      switch (error.constructor) {
        case PayableNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { payable: PayablePresenter.toHTTP(receivedPayable.value) }
  }
}
