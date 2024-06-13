import { PayableNonExistsError } from '@/domain/application/errors/payable-non-exists'
import { UpdatePayableService } from '@/domain/application/services/payable/update-payable'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/documentation/responses/error-docs-response'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PayablePresenter } from '@/infra/http/presenters/presenter-payable'
import { Body, Controller, HttpException, Param, Patch } from '@nestjs/common'
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

const updatePayableDTO = z.object({
  value: z.number().optional(),
  emissionDate: z.string().datetime(),
})

export type UpdatePayableDTO = z.infer<typeof updatePayableDTO>

const bodyValidation = new ZodValidationPipe(updatePayableDTO)

@ApiTags('payable')
@Controller('/payable')
export class UpdatePayableController {
  constructor(private updatePayableService: UpdatePayableService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        emissionDate: { type: 'string', format: 'date-time' },
      },
      example: {
        value: 1000,
        emissionDate: '2024-06-13T18:26:50.421Z',
      },
      description: 'Value and emission date',
    },
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
    description: 'Error updating a payable',
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
  @Patch('/:id')
  async handle(
    @Param('id') id: string,
    @Body(bodyValidation) body: UpdatePayableDTO,
    @CurrentUser() payable: UserPayload,
  ) {
    const { value, emissionDate } = body

    const { sub } = payable

    const updatedPayable = await this.updatePayableService.execute({
      assignorId: sub,
      id,
      emissionDate: new Date(emissionDate),
      value,
    })

    if (updatedPayable.isLeft()) {
      const error = updatedPayable.value
      switch (error.constructor) {
        case PayableNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { payable: PayablePresenter.toHTTP(updatedPayable.value) }
  }
}
