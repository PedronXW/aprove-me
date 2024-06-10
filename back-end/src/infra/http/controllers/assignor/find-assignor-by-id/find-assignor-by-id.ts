import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { FindAssignorByIdService } from '@/domain/application/services/assignor/find-assignor-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import { AssignorPresenter } from '@/infra/http/presenters/presenter-assignor'
import { Controller, Get, HttpException } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@ApiTags('assignor')
@Controller('/assignor')
export class FindAssignorByIdController {
  constructor(
    private readonly findAssignorByIdService: FindAssignorByIdService,
  ) {}

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        assignor: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', maxLength: 140 },
            email: { type: 'string', maxLength: 140 },
            document: { type: 'string', maxLength: 30 },
            phone: { type: 'string', maxLength: 20 },
            active: { type: 'boolean' },
          },
        },
      },
    },
    description: 'Assignor updated',
    status: 200,
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'Error getting the resource',
    status: 400,
    type: ErrorDocsResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    status: 401,
    type: ErrorDocsResponse,
  })
  @ApiForbiddenResponse({
    description: 'Assignor does not exist',
    status: 403,
    type: ErrorDocsResponse,
  })
  @Get()
  async handle(@CurrentUser() assignor: UserPayload) {
    const { sub } = assignor

    const receivedAssignor = await this.findAssignorByIdService.execute({
      id: sub,
    })

    if (receivedAssignor.isLeft()) {
      const error = receivedAssignor.value
      switch (error.constructor) {
        case AssignorNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { assignor: AssignorPresenter.toHTTP(receivedAssignor.value) }
  }
}
