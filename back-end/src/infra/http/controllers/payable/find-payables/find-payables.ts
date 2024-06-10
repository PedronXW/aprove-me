import { PaginationError } from '@/domain/application/errors/pagination-error'
import { FindPayablesService } from '@/domain/application/services/payable/find-payables'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import { PayablePresenter } from '@/infra/http/presenters/presenter-payable'
import { Controller, Get, HttpException, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@ApiTags('payable')
@Controller('/payable')
export class FindPayablesController {
  constructor(private readonly findPayablesService: FindPayablesService) {}

  @ApiQuery({
    name: 'page',
    type: 'string',
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: 'string',
    description: 'Limit of payables per page',
  })
  @ApiOkResponse({
    description: 'Assignor updated',
    status: 200,
    schema: {
      type: 'object',
      properties: {
        schema: {
          type: 'object',
          properties: {
            payable: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                value: { type: 'number' },
                emissionDate: { type: 'date string' },
                status: { type: 'string' },
              },
            },
          },
        },
        payablesCount: {
          type: 'number',
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'Error getting payables',
    status: 400,
    type: ErrorDocsResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    status: 401,
    type: ErrorDocsResponse,
  })
  @Get()
  async handle(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @CurrentUser() payable: UserPayload,
  ) {
    const { sub } = payable

    const receivedPayable = await this.findPayablesService.execute({
      limit: Number.parseInt(limit),
      page: Number.parseInt(page),
      assignorId: sub,
    })

    if (receivedPayable.isLeft()) {
      const error = receivedPayable.value
      switch (error.constructor) {
        case PaginationError:
          throw new HttpException(error.message, 400)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return {
      payables: receivedPayable.value.payables.map(PayablePresenter.toHTTP),
      payablesCount: receivedPayable.value.payablesCount,
    }
  }
}
