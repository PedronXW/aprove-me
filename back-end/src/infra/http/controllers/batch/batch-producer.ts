import { BatchCreationService } from '@/domain/application/services/payable/batch-creation'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

const batchInsertionDTO = z.object({
  payables: z
    .array(
      z.object({
        value: z.number(),
        emissionDate: z
          .string()
          .date()
          .transform((value) => new Date(value)),
      }),
    )
    .max(10000),
})

export type BatchInsertionDto = z.infer<typeof batchInsertionDTO>

const bodyValidation = new ZodValidationPipe(batchInsertionDTO)

@ApiTags('payable')
@Controller()
export class BatchProducerController {
  constructor(private batchCreationService: BatchCreationService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        payables: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'number' },
              emissionDate: { type: 'string', format: 'date-time' },
            },
            required: ['value', 'emissionDate'],
          },
        },
      },
      required: ['payables'],
      description: 'List of payables',
    },
  })
  @ApiOkResponse({
    description: 'Batch created',
    status: 201,
  })
  @ApiBearerAuth()
  @Post('payable/batch')
  async handle(
    @Body(bodyValidation) batch: BatchInsertionDto,
    @CurrentUser() user: UserPayload,
  ): Promise<void> {
    const { sub } = user

    await this.batchCreationService.execute({
      payables: batch.payables,
      assignorId: sub,
    })
  }
}
