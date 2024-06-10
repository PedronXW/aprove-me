import { AssignorNonExistsError } from '@/domain/application/errors/assignor-non-exists-error'
import { InactiveAssignorError } from '@/domain/application/errors/inactive-assignor-error'
import { CreatePayableService } from '@/domain/application/services/payable/create-payable'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PayablePresenter } from '@/infra/http/presenters/presenter-payable'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'

const createPayableDTO = z.object({
  value: z.number(),
  emissionDate: z.string(),
})

export type CreatePayableDTO = z.infer<typeof createPayableDTO>

const bodyValidation = new ZodValidationPipe(createPayableDTO)

@ApiTags('payable')
@Controller('/payable')
export class CreatePayableController {
  constructor(private createPayableService: CreatePayableService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        emissionDate: { type: 'string' },
      },
      required: ['value', 'emissionDate'],
      description: 'Value and emission date',
    },
  })
  @ApiOkResponse({
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
    description: 'Assignor updated',
    status: 201,
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'Error creating a payable',
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
  @Post()
  async handle(
    @Body(bodyValidation) body: CreatePayableDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { value, emissionDate } = body

    const { sub } = user

    const payable = await this.createPayableService.execute({
      assignorId: sub,
      value,
      emissionDate: new Date(emissionDate),
    })

    if (payable.isLeft()) {
      const error = payable.value
      switch (error.constructor) {
        case InactiveAssignorError:
          throw new HttpException(error.message, 403)
        case AssignorNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { payable: PayablePresenter.toHTTP(payable.value) }
  }
}
