import { BatchCreationService } from '@/domain/application/services/payable/batch-creation'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const batchInsertionDTO = z.object({
  payables: z
    .array(
      z.object({
        value: z.number(),
        emissionDate: z.string().transform((value) => new Date(value)),
      }),
    )
    .max(10000),
})

export type BatchInsertionDto = z.infer<typeof batchInsertionDTO>

const bodyValidation = new ZodValidationPipe(batchInsertionDTO)

@Controller()
export class BatchProducerController {
  constructor(private batchCreationService: BatchCreationService) {}

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
